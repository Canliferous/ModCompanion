import MainAssetFileWatcher from "./assets/MainAssetFileWatcher.js";

export function initAssetScannerSystem(): boolean {
    return MainAssetFileWatcher.startFileWatcher();
}
