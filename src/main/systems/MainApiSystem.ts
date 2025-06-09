import { registerLauncherApi } from "../api/MainLauncherApi.js";
import { registerMapScannerApi } from "../api/MainMapScannerApi.js";
import { registerAppExitApi } from "../api/MainAppExitApi.js";
import { registerMapCompileApi } from "../api/MainMapCompileApi.js";
import { registerAppConfigApi } from "../api/MainAppConfigApi.js";
import { registerMapTimeReportApi } from "../api/MainMapTimeReportApi.js";
import { registerFileBrowserApi } from "../api/MainFileBrowserApi.js";

const apis: (() => boolean)[] = [
    registerAppExitApi,
    registerAppConfigApi,
    registerLauncherApi,
    registerMapScannerApi,
    registerMapCompileApi,
    registerMapTimeReportApi,
    registerFileBrowserApi,
];

export function initApiSystem(): boolean {
    for (const api of apis) {
        if (!api()) {
            console.error(`Failed to initialize api ${api.name}`);
            return false;
        }
    }

    return true;
}
