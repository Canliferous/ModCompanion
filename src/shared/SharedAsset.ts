export interface SharedAsset {
    hash: string;
    displayName: string;
    contentFiles: string[];
    gameFiles: string[];
}

export type SharedAssetHash = string;

export interface SharedAssetRescanEvent {
    assets: Map<SharedAssetHash, SharedAsset>;
    totalTimeMillis: number;
}
