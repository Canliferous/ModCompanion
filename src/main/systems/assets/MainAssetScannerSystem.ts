import MainAssetFileWatcher from "./MainAssetFileWatcher.js";

export function initAssetScannerSystem(): boolean {
    return MainAssetFileWatcher.startFileWatcher();
    return true;
}
