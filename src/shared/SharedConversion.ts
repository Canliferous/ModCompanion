import { SharedAssetHash } from "./SharedAsset.js";

export enum SharedConversionState {
    Unknown,
    Pending,
    InProgress,
    Finished,
}

export interface SharedConversion {
    state: SharedConversionState;
    hash: SharedAssetHash;
}

export interface SharedConversionUpdateEvent {
    conversions: Map<SharedAssetHash, SharedConversion>;
}
