import { getMainWindow } from "../systems/MainWindowSystem.js";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";
import { SharedAssetRescanEvent } from "../../shared/SharedAsset.js";
import { ipcMain } from "electron";
import { rescan } from "../systems/MainAssetScannerSystem.js";

export function registerAssetApi(): boolean {
    ipcMain.on(SharedIpcChannels.AssetForceRescan, (event) => {
        rescan();
    });

    return true;
}

export function notifyAssetsRescanned(event: SharedAssetRescanEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.AssetRescanned, event);
}
