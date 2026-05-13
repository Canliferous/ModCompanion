import { app } from "electron";
import { WindowSystem } from "./systems/MainWindowSystem.js";
import { initApiSystem } from "./systems/MainApiSystem.js";
import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";
import { notifyLogFromMain } from "./api/MainLoggerApi.js";
import { AssetRepositoryApi } from "./api/MainAssetApi.js";
import { notifyAssetGroupsUpdated } from "./api/MainAssetGroupsApi.js";
import { notifyConversionsUpdated } from "./api/MainConversionApi.js";
import { notifyMapCompileLog, notifyMapCompileProgress, notifyMapQueueUpdated } from "./api/MainMapCompileApi.js";
import { FileBrowserApi } from "./api/MainFileBrowserApi.js";
import {
    notifyStrataInteropConnected,
    notifyStrataInteropDisconnected,
    notifyStrataInteropLog,
} from "./api/MainStrataInteropApi.js";

type SystemFunction = () => Promise<boolean> | boolean;
interface System {
    initFunction: SystemFunction;
    name: string;
}
const systems: System[] = [
    { name: "Log", initFunction: () => Core.Logger.initSystem(notifyLogFromMain) },
    { name: "Config", initFunction: Core.ConfigSystem.initConfigSystem },
    { name: "FileBrowser", initFunction: () => Core.FileBrowserSystem.initSystem(FileBrowserApi.notifyDirUpdated) },
    {
        name: "AssetRepository",
        initFunction: () => Core.AssetRepositorySystem.initSystem(AssetRepositoryApi.notifyAssetsRescanned),
    },
    { name: "Api", initFunction: initApiSystem },
    { name: "Window", initFunction: WindowSystem.initSystem },
    {
        name: "MapCompile",
        initFunction: () =>
            Core.MapCompileSystem.initSystem({
                queueFunc: notifyMapQueueUpdated,
                logFunc: notifyMapCompileLog,
                progressFunc: notifyMapCompileProgress,
            }),
    },
    {
        name: "AssetWatcher",
        initFunction: () => Core.AssetWatcherSystem.initSystem(AssetRepositoryApi.notifyAssetsUpdated),
    },
    { name: "MareTf", initFunction: Core.MareTfSystem.initSystem },
    { name: "ConversionAgent", initFunction: () => Core.ConversionAgentSystem.initSystem(notifyConversionsUpdated) },
    {
        name: "StrataInterop",
        initFunction: () =>
            Core.StrataInteropSystem.initSystem({
                connectedFunc: notifyStrataInteropConnected,
                disconnectedFunc: notifyStrataInteropDisconnected,
                messageFunc: notifyStrataInteropLog,
            }),
    },
    { name: "AssetGroups", initFunction: () => Core.AssetGroupsSystem.initSystem(notifyAssetGroupsUpdated) },
    { name: "TeamCityArtifactCloud", initFunction: Core.TcArtifactsSystem.initSystem },
];

async function startSystems() {
    let success = false;
    for (const system of systems) {
        const systemResult = system.initFunction();

        success = false;
        try {
            if (typeof systemResult === "boolean") {
                success = systemResult;
            } else if (typeof systemResult === "object") {
                success = await systemResult;
            }
        } catch (e) {
            Core.Logger.error(Shared.Log.Channel.MainSystems, e);
            success = false;
        }

        if (!success) {
            Core.Logger.info(Shared.Log.Channel.MainSystems, `${system.name} System FAIL`);
            break;
        } else {
            Core.Logger.info(Shared.Log.Channel.MainSystems, `${system.name} System OK`);
        }
    }

    if (success) {
        Core.Logger.info(Shared.Log.Channel.MainSystems, "All systems started successfully!");
    } else {
        app.quit();
    }
}

function performPreStartChecks(): boolean {
    const lock = app.requestSingleInstanceLock();
    if (!lock) {
        return false;
    } else {
        app.on("second-instance", () => {
            const mainWindow = WindowSystem.getMainWindow();
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.show();
                mainWindow.maximize();
                mainWindow.focus();
            }
        });
    }

    return true;
}

function start() {
    app.setName("Mod Companion");
    if (!performPreStartChecks()) {
        return;
    }

    Core.Logger.info(Shared.Log.Channel.MainSystems, "Starting Mod Companion");
    Core.Logger.info(Shared.Log.Channel.MainSystems, "App User Data", app.getPath("userData"));

    startSystems();
}

start();
