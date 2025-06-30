import { SharedAssetId } from "./SharedAsset.js";

export enum SharedConversionState {
    Unknown,
    Pending,
    InProgress,
    FinishedJob,
    FinishedConfirmed,
}

export interface SharedConversion {
    state: SharedConversionState;
    hash: SharedAssetId;
}

export interface SharedConversionUpdateEvent {
    conversions: Map<SharedAssetId, SharedConversion>;
}
