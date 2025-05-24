import { registerLauncherApi } from "../api/MainLauncherApi.js";
import { registerMapScannerApi } from "../api/MainMapScannerApi.js";
import { registerExitAppApi } from "../api/ExitAppApi.js";

const apis: (() => boolean)[] = [registerExitAppApi, registerLauncherApi, registerMapScannerApi];

export function initApiSystem(): boolean {
    for (const api of apis) {
        if (!api()) {
            console.error(`Failed to initialize api ${api.name}`);
            return false;
        }
    }

    return true;
}
