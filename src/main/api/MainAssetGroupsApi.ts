import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import {
    SharedAssetGroup,
    SharedAssetGroupDefinition,
    SharedAssetGroupId,
    SharedAssetGroupRescanEvent,
} from "Shared/SharedAssetGroup.js";
import { AssetGroupsSystem } from "Core/systems/CoreAssetGroupsSystem.js";
import { IpcHelper } from "./MainApiHelper.js";

export function registerAssetGroupsApi(): boolean {
    ipcMain.handle(
        SharedIpcChannels.AssetGroupsCreate,
        (event, groupDef: SharedAssetGroupDefinition): Promise<SharedAssetGroup> => {
            return AssetGroupsSystem.write(AssetGroupsSystem.generateId(), groupDef);
        },
    );
    ipcMain.handle(
        SharedIpcChannels.AssetGroupsUpdate,
        (event, id: SharedAssetGroupId, groupDef: SharedAssetGroupDefinition): Promise<SharedAssetGroup> => {
            return AssetGroupsSystem.write(id, groupDef);
        },
    );
    ipcMain.on(SharedIpcChannels.AssetGroupsForceRescan, (): void => {
        AssetGroupsSystem.scan();
    });
    ipcMain.on(SharedIpcChannels.AssetGroupsDelete, (event, groupId: SharedAssetGroupId): void => {
        AssetGroupsSystem.delete(groupId);
    });

    return true;
}

export function notifyAssetGroupsUpdated(event: SharedAssetGroupRescanEvent): void {
    IpcHelper.send(SharedIpcChannels.AssetGroupsRescanned, event);
}
