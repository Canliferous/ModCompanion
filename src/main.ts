import { initWindowSystem } from "./main/systems/window-system.js";
import { initConfigSystem } from "./main/systems/config-system.js";
import { initApiSystem } from "./main/systems/api-system.js";

type SystemFunction = () => Promise<boolean> | boolean;
interface System {
    initFunction: SystemFunction;
    name: string;
}
const systems: System[] = [
    { name: "Config", initFunction: initConfigSystem },
    { name: "Api", initFunction: initApiSystem },
    { name: "Window", initFunction: initWindowSystem },
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

startSystems();
