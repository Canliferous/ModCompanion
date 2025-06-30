export enum SharedAssetType {
    Unknown = "",
    Texture = "texture",
    Model = "model",
}

export function isValidAssetType(str: string): str is SharedAssetType {
    return (Object.values(SharedAssetType) as string[]).includes(str);
}

export interface SharedAsset {
    readonly id: string;
    readonly type: SharedAssetType;
    readonly displayName?: string;
    readonly contentFiles?: string[];
    readonly gameFiles?: string[];
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

export interface SharedTextureAsset extends SharedAsset {
    type: SharedAssetType.Texture;
}

export function isTextureAsset(asset: SharedAsset): asset is SharedTextureAsset {
    return asset.type === SharedAssetType.Texture;
}
