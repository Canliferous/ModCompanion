import { registerLauncherApi } from "../api/MainLauncherApi.js";
import { registerMapScannerApi } from "../api/MainMapScannerApi.js";
import { registerAppExitApi } from "../api/MainAppExitApi.js";
import { registerMapCompileApi } from "../api/MainMapCompileApi.js";
import { registerAppConfigApi } from "../api/MainAppConfigApi.js";
import { registerMapTimeReportApi } from "../api/MainMapTimeReportApi.js";
import { registerFileBrowserApi } from "../api/MainFileBrowserApi.js";
import { registerAssetApi } from "../api/MainAssetApi.js";
import { registerImageMetaApi } from "../api/MainImageMetaApi.js";
import { registerConversionApi } from "../api/MainConversionApi.js";
import { registerHotReloadApi } from "../api/MainHotReloadApi.js";
import { registerAssetGroupsApi } from "../api/MainAssetGroupsApi.js";
import { registerClipboardApi } from "../api/MainClipboardApi.js";
import { registerStrataInteropApi } from "../api/MainStrataInteropApi.js";
import { registerFgdApi } from "../api/MainFgdApi.js";
import { registerTcArtifactsApi } from "../api/MainTcArtifactsApi.js";
import { registerFileApi } from "../api/MainFileApi.js";
import { registerLoggerApi } from "../api/MainLoggerApi.js";
import { registerMdlInfoApi } from "../api/MainMdlInfoApi.js";

const apis: (() => boolean)[] = [
    registerLoggerApi,
    registerAppExitApi,
    registerAppConfigApi,
    registerLauncherApi,
    registerMapScannerApi,
    registerMapCompileApi,
    registerMapTimeReportApi,
    registerFileBrowserApi,
    registerAssetApi,
    registerImageMetaApi,
    registerConversionApi,
    registerHotReloadApi,
    registerAssetGroupsApi,
    registerClipboardApi,
    registerStrataInteropApi,
    registerFgdApi,
    registerTcArtifactsApi,
    registerFileApi,
    registerMdlInfoApi,
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
