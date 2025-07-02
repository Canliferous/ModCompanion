import { SharedAssetId } from "./SharedAssetDefinition.js";

export enum SharedConversionState {
    Unknown = "",
    Pending = "pending",
    PendingForced = "pending_forced",
    InProgress = "in_progress",
    FinishedJob = "finished_job",
    FinishedConfirmed = "finished_confirmed",
}

export interface SharedConversion {
    state: SharedConversionState;
    hash: SharedAssetId;
}

export interface SharedConversionUpdateEvent {
    conversions: Map<SharedAssetId, SharedConversion>;
}
