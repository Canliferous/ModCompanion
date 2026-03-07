import { app } from "electron";
import { WindowSystem } from "./systems/MainWindowSystem.js";
import { initApiSystem } from "./systems/MainApiSystem.js";
import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

let headless = false;
export function isHeadless() {
    return headless;
}

type SystemFunction = () => Promise<boolean> | boolean;
interface System {
    initFunction: SystemFunction;
    name: string;
    disableForHeadless?: boolean;
}
const systems: System[] = [
    { name: "Log", initFunction: Core.Logger.initSystem },
    { name: "Config", initFunction: Core.ConfigSystem.initConfigSystem },
    // { name: "Protocol", initFunction: initProtocolSystem },
    { name: "Api", initFunction: initApiSystem },
    { name: "Window", initFunction: WindowSystem.initSystem, disableForHeadless: true },
    { name: "MapCompile", initFunction: Core.MapCompileSystem.initSystem },
    { name: "AssetWatcher", initFunction: Core.AssetWatcherSystem.initSystem },
    { name: "MareTf", initFunction: Core.MareTfSystem.initSystem },
    { name: "ConversionAgent", initFunction: Core.ConversionAgentSystem.initSystem },
    { name: "StrataInterop", initFunction: Core.StrataInteropSystem.initSystem },
    { name: "AssetGroups", initFunction: Core.AssetGroupsSystem.initSystem },
    { name: "TeamCityArtifactCloud", initFunction: Core.TcArtifactsSystem.initSystem },
    { name: "FileBrowser", initFunction: Core.FileBrowserSystem.initSystem },
];

async function startSystems() {
    const cmdConvert = app.commandLine.hasSwitch("convert");
    if (cmdConvert) {
        headless = true;
    }

    if (isHeadless()) {
        Core.Logger.info(Shared.Log.Channel.MainSystems, "Starting systems in headless mode...");
    } else {
        Core.Logger.info(Shared.Log.Channel.MainSystems, "Starting systems...");
    }

    let success = false;
    for (const system of systems) {
        if (isHeadless() && system.disableForHeadless) {
            Core.Logger.info(Shared.Log.Channel.MainSystems, `Skipping ${system.name} system for headless mode`);
            continue;
        }

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

        if (cmdConvert) {
            await runConvert();
        }
    } else {
        app.quit();
    }
}

async function runConvert() {
    Core.Logger.info(Shared.Log.Channel.MainSystems, "Running convert command");
    await Core.AssetRepository.rescan();
    await Core.ConversionAgentSystem.runAndConvertUntilItIsDone();
    Core.Logger.info(Shared.Log.Channel.MainSystems, "Convert command done. Goodbye");
    app.quit();
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
