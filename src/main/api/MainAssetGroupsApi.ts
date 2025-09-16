import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedAssetGroup, SharedAssetGroupDefinition, SharedAssetGroupRescanEvent } from "Shared/SharedAssetGroup.js";
import { getMainWindow } from "../systems/MainWindowSystem.js";
import { writeAssetGroup, scanAssetGroups } from "../systems/MainAssetGroupsSystem.js";

export function registerAssetGroupsApi(): boolean {
    ipcMain.handle(
        SharedIpcChannels.AssetGroupsCreate,
        (event, assetGroupDef: SharedAssetGroupDefinition): Promise<SharedAssetGroup> => {
            return writeAssetGroup(assetGroupDef);
        },
    );
    ipcMain.on(SharedIpcChannels.AssetGroupsForceRescan, (event): void => {
        scanAssetGroups();
    });

    return true;
}

export function notifyAssetGroupsUpdated(event: SharedAssetGroupRescanEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.AssetGroupsRescanned, event);
}
