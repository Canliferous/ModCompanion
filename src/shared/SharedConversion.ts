import { SharedAssetId } from "./SharedAssetDefinition.js";

export enum SharedConversionState {
    Unknown = "unknown",
    Invalid = "invalid",
    Pending = "pending",
    PendingForced = "pending_forced",
    InProgress = "in_progress",
    FinishedJob = "finished_job",
    FinishedConfirmed = "finished_confirmed",
    FinishedFailed = "finished_failed",
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
            return "Finished (Unconfirmed";
        case SharedConversionState.FinishedConfirmed:
            return "Finished";
        case SharedConversionState.FinishedFailed:
            return "Failed";
        case SharedConversionState.Unknown:
        default:
            return "Unknown";
    }
}

export function getConversionStateColor(state: SharedConversionState): string {
    switch (state) {
        case SharedConversionState.Invalid:
        case SharedConversionState.FinishedFailed: {
            return "error";
        }
        case SharedConversionState.InProgress: {
            return "info";
        }
        case SharedConversionState.FinishedJob:
        case SharedConversionState.FinishedConfirmed: {
            return "success";
        }
        case SharedConversionState.Pending:
        case SharedConversionState.PendingForced:
        case SharedConversionState.Unknown:
        default: {
            return "neutral";
        }
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
