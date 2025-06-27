export enum SharedAssetType {
    Unknown,
    Texture,
    Model,
    Material,
}

export interface SharedAsset {
    hash: string;
    displayName: string;
    contentFiles: string[];
    gameFiles: string[];
    type: SharedAssetType;
}

export type SharedAssetHash = string;

export interface SharedAssetRescanEvent {
    assets: Map<SharedAssetHash, SharedAsset>;
    totalTimeMillis?: number;
}

export interface SharedAssetAddedEvent {
    assets: SharedAsset[];
}

export interface SharedAssetUpdatedEvent {
    assets: SharedAsset[];
}

export type SharedAssetMap = Map<SharedAssetHash, SharedAsset>;
