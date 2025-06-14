import { getMainWindow } from "../systems/MainWindowSystem.js";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";
import { SharedAssetAddedEvent, SharedAssetRescanEvent } from "../../shared/SharedAsset.js";
import { ipcMain } from "electron";
import MainAssetRepository from "../systems/assets/MainAssetRepository.js";

export function registerAssetApi(): boolean {
    ipcMain.on(SharedIpcChannels.AssetForceRescan, (event) => {
        MainAssetRepository.rescan();
    });

    return true;
}

export function notifyAssetsRescanned(event: SharedAssetRescanEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.AssetRescanned, event);
}

export function notifyAssetsAdded(event: SharedAssetAddedEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.AssetAdded, event);
}
