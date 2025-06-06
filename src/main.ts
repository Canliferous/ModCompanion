import { initWindowSystem } from "./main/systems/MainWindowSystem.js";
import { initConfigSystem } from "./main/systems/MainConfigSystem.js";
import { initApiSystem } from "./main/systems/MainApiSystem.js";
import { app, dialog } from "electron";
import { initMapCompileSystem } from "./main/systems/MainMapCompileSystem.js";

type SystemFunction = () => Promise<boolean> | boolean;
interface System {
    initFunction: SystemFunction;
    name: string;
}
const systems: System[] = [
    { name: "Config", initFunction: initConfigSystem },
    { name: "Api", initFunction: initApiSystem },
    { name: "Window", initFunction: initWindowSystem },
    { name: "MapCompile", initFunction: initMapCompileSystem },
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
