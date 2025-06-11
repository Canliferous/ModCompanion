import { getMainWindow } from "../systems/MainWindowSystem.js";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";
import { SharedAssetRescanEvent } from "../../shared/SharedAsset.js";

export function notifyAssetsRescanned(event: SharedAssetRescanEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.AssetRescanned, event);
}
