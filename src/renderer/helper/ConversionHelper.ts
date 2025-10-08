import { SharedConversionState } from "Shared/SharedConversion.js";

export function summarizeConversionStates(states: SharedConversionState[]): SharedConversionState {
    for (const state of states) {
        if (state === SharedConversionState.InProgress) return SharedConversionState.InProgress;
        if (state === SharedConversionState.Failed) return SharedConversionState.Failed;
        if (state === SharedConversionState.Invalid) return SharedConversionState.Invalid;
        if (state === SharedConversionState.Pending || state === SharedConversionState.PendingForced)
            return SharedConversionState.Pending;
        if (state === SharedConversionState.Unknown) return SharedConversionState.Unknown;
    }

    return SharedConversionState.Finished;
}
