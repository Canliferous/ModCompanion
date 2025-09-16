import { SharedAssetId } from "./SharedAssetDefinition.js";

export interface SharedAssetGroupDefinition {
    assets: SharedAssetId[];
    displayName: string;
}

export type SharedAssetGroupId = string;

export interface SharedAssetGroup {
    def: SharedAssetGroupDefinition;
    filePath: string;
    id: SharedAssetGroupId;
}

export interface SharedAssetGroupRescanEvent {
    groups: Map<SharedAssetGroupId, SharedAssetGroup>;
}
