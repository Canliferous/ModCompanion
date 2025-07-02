import { SharedVtfCreateOptions } from "./SharedMareTf.js";

export enum SharedAssetType {
    Unknown = "",
    Texture = "texture",
    Model = "model",
}

export function isValidAssetType(str: string): str is SharedAssetType {
    return (Object.values(SharedAssetType) as string[]).includes(str);
}

export interface SharedAssetDefinition {
    readonly id: string;
    readonly type: SharedAssetType;
    readonly displayName?: string;
    readonly contentFiles?: string[];
    readonly gameFiles?: string[];

    readonly associatedFiles?: SharedAssetDefinitionAssociatedFiles;
}

export interface SharedAssetDefinitionAssociatedFiles {
    substanceDesigner?: string;
    blender?: string;
}

export interface SharedAsset {
    /** Asset definition data read from the mca file */
    readonly def: SharedAssetDefinition;

    /** Path to the mca file */
    readonly defFilePath?: string;
}

export interface SharedTextureAsset extends SharedAsset {
    /** @inheritDoc */
    readonly def: SharedTextureAssetDefinition;
}

export type SharedAssetId = string;

export interface SharedAssetRescanEvent {
    assets: Map<SharedAssetId, SharedAsset>;
    totalTimeMillis?: number;
}

export interface SharedAssetAddedEvent {
    assets: SharedAsset[];
}

export interface SharedAssetUpdatedEvent {
    assets: SharedAsset[];
}

export type SharedAssetMap = Map<SharedAssetId, SharedAsset>;

export interface SharedTextureAssetDefinition extends SharedAssetDefinition {
    type: SharedAssetType.Texture;
    vtfOptions?: SharedVtfCreateOptions;
}

export function isTextureAsset(asset: SharedAssetDefinition): asset is SharedTextureAssetDefinition {
    return asset.type === SharedAssetType.Texture;
}
