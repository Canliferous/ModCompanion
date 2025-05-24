import { registerLauncherApi } from "../api/MainLauncherApi.js";
import { registerMapScannerApi } from "../api/MainMapScannerApi.js";
import { registerExitAppApi } from "../api/ExitAppApi.js";
import { registerMapCompileApi } from "../api/MapCompileApi.js";

const apis: (() => boolean)[] = [registerExitAppApi, registerLauncherApi, registerMapScannerApi, registerMapCompileApi];

export function initApiSystem(): boolean {
    for (const api of apis) {
        if (!api()) {
            console.error(`Failed to initialize api ${api.name}`);
            return false;
        }
    }

    return true;
}
