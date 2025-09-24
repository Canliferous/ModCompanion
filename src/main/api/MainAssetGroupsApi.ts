import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import {
    SharedAssetGroup,
    SharedAssetGroupDefinition,
    SharedAssetGroupId,
    SharedAssetGroupRescanEvent,
} from "Shared/SharedAssetGroup.js";
import { getMainWindow } from "../systems/MainWindowSystem.js";
import {
    writeAssetGroup,
    scanAssetGroups,
    generateAssetGroupId,
    deleteAssetGroup,
} from "../systems/MainAssetGroupsSystem.js";

export function registerAssetGroupsApi(): boolean {
    ipcMain.handle(
        SharedIpcChannels.AssetGroupsCreate,
        (event, groupDef: SharedAssetGroupDefinition): Promise<SharedAssetGroup> => {
            return writeAssetGroup(generateAssetGroupId(), groupDef);
        },
    );
    ipcMain.handle(
        SharedIpcChannels.AssetGroupsUpdate,
        (event, id: SharedAssetGroupId, groupDef: SharedAssetGroupDefinition): Promise<SharedAssetGroup> => {
            return writeAssetGroup(id, groupDef);
        },
    );
    ipcMain.on(SharedIpcChannels.AssetGroupsForceRescan, (event): void => {
        scanAssetGroups();
    });
    ipcMain.on(SharedIpcChannels.AssetGroupsDelete, (event, groupId: SharedAssetGroupId): void => {
        deleteAssetGroup(groupId);
    });

    return true;
}

export function notifyAssetGroupsUpdated(event: SharedAssetGroupRescanEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.AssetGroupsRescanned, event);
}
