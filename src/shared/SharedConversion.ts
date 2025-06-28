import { SharedAssetHash } from "./SharedAsset.js";

export enum SharedConversionState {
    Unknown,
    Pending,
    InProgress,
    FinishedJob,
    FinishedConfirmed,
}

export interface SharedConversion {
    state: SharedConversionState;
    hash: SharedAssetHash;
}

export interface SharedConversionUpdateEvent {
    conversions: Map<SharedAssetHash, SharedConversion>;
}
