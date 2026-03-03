import { app } from "electron";
import { WindowSystem } from "./systems/MainWindowSystem.js";
import { initConfigSystem } from "Core/systems/CoreConfigSystem.js";
import { initApiSystem } from "./systems/MainApiSystem.js";
import { MapCompileSystem } from "Core/systems/CoreMapCompileSystem.js";
import { MareTfSystem } from "Core/systems/CoreMaretfSystem.js";
import { ConversionAgentSystem } from "Core/systems/conversion/CoreConversionAgentSystem.js";
import { StrataInteropSystem } from "Core/systems/CoreStrataInteropSystem.js";
import { AssetGroupsSystem } from "Core/systems/CoreAssetGroupsSystem.js";
import { ConversionChecksumSystem } from "Core/systems/conversion/CoreConversionChecksumSystem.js";
import { AssetWatcherSystem } from "Core/systems/CoreAssetWatcherSystem.js";
import { TcArtifactsSystem } from "Core/systems/CoreTcArtifactsSystem.js";
import { FileBrowserSystem } from "Core/systems/CoreFileBrowserSystem.js";
import MainAssetRepository from "Core/systems/asset/CoreAssetRepository.js";
import { Logger } from "Core/systems/CoreLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

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
    { name: "Log", initFunction: Logger.initSystem },
    { name: "Config", initFunction: initConfigSystem },
    // { name: "Protocol", initFunction: initProtocolSystem },
    { name: "Api", initFunction: initApiSystem },
    { name: "Window", initFunction: WindowSystem.initSystem, disableForHeadless: true },
    { name: "MapCompile", initFunction: MapCompileSystem.initSystem },
    { name: "AssetWatcher", initFunction: AssetWatcherSystem.initSystem },
    { name: "MareTf", initFunction: MareTfSystem.initSystem },
    { name: "ConversionAgent", initFunction: ConversionAgentSystem.initSystem },
    { name: "ConversionChecksum", initFunction: ConversionChecksumSystem.initSystem },
    { name: "StrataInterop", initFunction: StrataInteropSystem.initSystem },
    { name: "AssetGroups", initFunction: AssetGroupsSystem.initSystem },
    { name: "TeamCityArtifactCloud", initFunction: TcArtifactsSystem.initSystem },
    { name: "FileBrowser", initFunction: FileBrowserSystem.initSystem },
];

async function startSystems() {
    const cmdConvert = app.commandLine.hasSwitch("convert");
    if (cmdConvert) {
        headless = true;
    }

    if (isHeadless()) {
        Logger.info(SharedLogChannel.MainSystems, "Starting systems in headless mode...");
    } else {
        Logger.info(SharedLogChannel.MainSystems, "Starting systems...");
    }

    let success = false;
    for (const system of systems) {
        if (isHeadless() && system.disableForHeadless) {
            Logger.info(SharedLogChannel.MainSystems, `Skipping ${system.name} system for headless mode`);
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
            Logger.error(SharedLogChannel.MainSystems, e);
            success = false;
        }

        if (!success) {
            Logger.info(SharedLogChannel.MainSystems, `${system.name} System FAIL`);
            break;
        } else {
            Logger.info(SharedLogChannel.MainSystems, `${system.name} System OK`);
        }
    }

    if (success) {
        Logger.info(SharedLogChannel.MainSystems, "All systems started successfully!");

        if (cmdConvert) {
            await runConvert();
        }
    } else {
        app.quit();
    }
}

async function runConvert() {
    Logger.info(SharedLogChannel.MainSystems, "Running convert command");
    await MainAssetRepository.rescan();
    await ConversionAgentSystem.runAndConvertUntilItIsDone();
    Logger.info(SharedLogChannel.MainSystems, "Convert command done. Goodbye");
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

    Logger.info(SharedLogChannel.MainSystems, "Starting Mod Companion");
    Logger.info(SharedLogChannel.MainSystems, "App User Data", app.getPath("userData"));

    startSystems();
}

start();
