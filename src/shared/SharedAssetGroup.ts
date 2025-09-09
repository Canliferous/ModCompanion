import { SharedAssetId } from "./SharedAssetDefinition.js";

export interface SharedAssetGroupDefinition {
    assets: SharedAssetId[];
    displayName: string;
}

export interface SharedAssetGroup {
    def: SharedAssetGroupDefinition;
    filePath: string;
}
