import { SharedAssetId } from "./SharedAssetDefinition.js";

export enum SharedConversionState {
    Unknown = "unknown",
    Invalid = "invalid",
    Pending = "pending",
    PendingForced = "pending_forced",
    InProgress = "in_progress",
    FinishedJob = "finished_job",
    FinishedConfirmed = "finished_confirmed",
}

export function getConversionStateName(state: SharedConversionState): string {
    switch (state) {
        case SharedConversionState.Invalid:
            return "Invalid";
        case SharedConversionState.Pending:
            return "Pending";
        case SharedConversionState.PendingForced:
            return "Pending (Forced)";
        case SharedConversionState.InProgress:
            return "In Progress";
        case SharedConversionState.FinishedJob:
            return "Finished Job";
        case SharedConversionState.FinishedConfirmed:
            return "Finished";
        case SharedConversionState.Unknown:
        default:
            return "Unknown";
    }
}

export interface SharedConversion {
    state: SharedConversionState;
    hash: SharedAssetId;
}

export interface SharedConversionUpdateEvent {
    conversions: Map<SharedAssetId, SharedConversion>;
}

export interface SharedConversionGetStateReport {
    conversions: Map<SharedAssetId, SharedConversion>;
}
