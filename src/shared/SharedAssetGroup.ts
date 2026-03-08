import { AssetId } from "./SharedAsset.js";

export interface SharedAssetGroupDefinition {
    assets: AssetId[];
    displayName: string;
}

export type GroupId = string;

export interface SharedAssetGroup {
    def: SharedAssetGroupDefinition;
    filePath: string;
    id: GroupId;
}

export interface SharedAssetGroupRescanEvent {
    groups: Map<GroupId, SharedAssetGroup>;
}
