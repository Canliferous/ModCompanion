import { AssetId } from "./SharedAsset.js";

export interface GroupDefinition {
    assets: AssetId[];
    displayName: string;
}

export type GroupId = string;

export interface SharedAssetGroup {
    def: GroupDefinition;
    filePath: string;
    id: GroupId;
}

export interface RescanEvent {
    groups: Map<GroupId, SharedAssetGroup>;
}

export type RescanNotifyFunc = (event: RescanEvent) => void;