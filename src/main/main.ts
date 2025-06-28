import { app, dialog } from "electron";
import { initWindowSystem } from "./systems/MainWindowSystem.js";
import { initConfigSystem } from "./systems/MainConfigSystem.js";
import { initApiSystem } from "./systems/MainApiSystem.js";
import { initMapCompileSystem } from "./systems/MainMapCompileSystem.js";
import { initAssetScannerSystem } from "./systems/MainAssetScannerSystem.js";
import { initProtocolSystem } from "./systems/MainProtocolSystem.js";
import { initMateTfSystem } from "./systems/MainMaretfSystem.js";

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
];

async function startSystems() {
    console.log("Starting systems...");

    let success = false;
    for (const system of systems) {
        const systemResult = system.initFunction();

        success = false;
        if (typeof systemResult === "boolean") {
            success = systemResult;
        } else if (typeof systemResult === "object") {
            success = await systemResult;
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

    startSystems();
}

start();
