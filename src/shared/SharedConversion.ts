import { SharedAssetId } from "./SharedAssetDefinition.js";

export enum SharedConversionState {
    Unknown = "unknown",
    Invalid = "invalid",
    Pending = "pending",
    PendingForced = "pending_forced",
    InProgress = "in_progress",
    Finished = "finished",
    Failed = "failed",
    NoChange = "no_change",
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
        case SharedConversionState.Finished:
            return "Finished";
        case SharedConversionState.Failed:
            return "Failed";
        case SharedConversionState.NoChange:
            return "No Change";
        case SharedConversionState.Unknown:
        default:
            return "Unknown";
    }
}

export function getConversionStateColor(state: SharedConversionState): string {
    switch (state) {
        case SharedConversionState.Invalid:
        case SharedConversionState.Failed: {
            return "error";
        }
        case SharedConversionState.InProgress: {
            return "info";
        }
        case SharedConversionState.Finished: {
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
    assetId: SharedAssetId;
}

export interface SharedConversionHistoryItem {
    assetId: SharedAssetId;
    stateBefore: SharedConversionState;
    stateAfter: SharedConversionState;
    startTime: Date;
    endTime: Date;
    log: string;
}

export interface SharedConversionUpdateEvent {
    conversions: Map<SharedAssetId, SharedConversion>;
    history: SharedConversionHistoryItem[];
}

export interface SharedConversionGetStateReport {
    conversions: Map<SharedAssetId, SharedConversion>;
}
