import { ipcMain } from "electron";
import { IpcHelper } from "./MainApiHelper.js";
import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerAssetGroupsApi(): boolean {
    ipcMain.handle(
        Shared.Ipc.Channels.AssetGroupsCreate,
        (event, groupDef: Shared.AssetGroup.GroupDefinition): Promise<Shared.AssetGroup.SharedAssetGroup> => {
            return Core.AssetGroupsSystem.write(Core.AssetGroupsSystem.generateId(), groupDef);
        },
    );
    ipcMain.handle(
        Shared.Ipc.Channels.AssetGroupsUpdate,
        (
            event,
            id: Shared.AssetGroup.GroupId,
            groupDef: Shared.AssetGroup.GroupDefinition,
        ): Promise<Shared.AssetGroup.SharedAssetGroup> => {
            return Core.AssetGroupsSystem.write(id, groupDef);
        },
    );
    ipcMain.on(Shared.Ipc.Channels.AssetGroupsForceRescan, (): void => {
        Core.AssetGroupsSystem.scan();
    });
    ipcMain.on(Shared.Ipc.Channels.AssetGroupsDelete, (event, groupId: Shared.AssetGroup.GroupId): void => {
        Core.AssetGroupsSystem.delete(groupId);
    });

    return true;
}

export function notifyAssetGroupsUpdated(event: Shared.AssetGroup.RescanEvent): void {
    IpcHelper.send(Shared.Ipc.Channels.AssetGroupsRescanned, event);
}
