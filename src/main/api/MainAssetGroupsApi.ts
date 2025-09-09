import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { writeAssetGroup } from "../systems/assetGroups/MainAssetGroups.js";
import { SharedAssetGroupDefinition } from "Shared/SharedAssetGroup.js";

export function registerAssetGroupsApi(): boolean {
    ipcMain.on(SharedIpcChannels.AssetGroupsCreate, (event, assetGroupDef: SharedAssetGroupDefinition) => {
        writeAssetGroup(assetGroupDef);
    });

    return true;
}
