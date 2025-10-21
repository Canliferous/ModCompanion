import { app, dialog } from "electron";
import { initWindowSystem } from "./systems/MainWindowSystem.js";
import { initConfigSystem } from "./systems/MainConfigSystem.js";
import { initApiSystem } from "./systems/MainApiSystem.js";
import { initMapCompileSystem } from "./systems/MainMapCompileSystem.js";
import { initAssetScannerSystem } from "./systems/assets/MainAssetScannerSystem.js";
import { initProtocolSystem } from "./systems/MainProtocolSystem.js";
import { initMateTfSystem } from "./systems/MainMaretfSystem.js";
import { initConvertAgentSystem } from "./systems/MainConversionAgentSystem.js";
import { initHotReloadSystem } from "./systems/MainHotReloadSystem.js";
import { initStrataInterop } from "./systems/MainStrataInteropSystem.js";
import { initAssetGroupsSystem } from "./systems/MainAssetGroupsSystem.js";

type SystemFunction = () => Promise<boolean> | boolean;
interface System {
    initFunction: SystemFunction;
    name: string;
}
const systems: System[] = [
    { name: "Config", initFunction: initConfigSystem },
    { name: "Protocol", initFunction: initProtocolSystem },
    { name: "Api", initFunction: initApiSystem },
    { name: "Window", initFunction: initWindowSystem },
    { name: "MapCompile", initFunction: initMapCompileSystem },
    { name: "AssetScanner", initFunction: initAssetScannerSystem },
    { name: "MareTf", initFunction: initMateTfSystem },
    { name: "ConversionAgent", initFunction: initConvertAgentSystem },
    { name: "StrataInterop", initFunction: initStrataInterop },
    { name: "HotReload", initFunction: initHotReloadSystem },
    { name: "AssetGroups", initFunction: initAssetGroupsSystem },
];

async function startSystems() {
    console.log("Starting systems...");

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
            console.error(e);
            success = false;
        }

        if (!success) {
            console.error(`${system.name} System FAIL`);
            break;
        } else {
            console.log(`${system.name} System OK`);
        }
    }

    if (success) {
        console.log("All systems started successfully!");
    } else {
        app.quit();
    }
}

function performPreStartChecks(): boolean {
    const lock = app.requestSingleInstanceLock();
    if (!lock) {
        app.whenReady().then(() => {
            dialog
                .showMessageBox({
                    title: "Mod Companion",
                    message: "App is already running",
                })
                .then(() => {
                    app.quit();
                });
        });
        return false;
    }

    return true;
}

function start() {
    app.setName("Mod Companion");
    if (!performPreStartChecks()) {
        return;
    }

    console.log("Starting Mod Companion");
    console.log("App User Data", app.getPath("userData"));

    startSystems();
}

start();
