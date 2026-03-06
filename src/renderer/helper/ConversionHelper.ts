import { State } from "Shared/SharedConversion.js";

export function summarizeConversionStates(states: State[]): State {
    for (const state of states) {
        if (state === State.InProgress) return State.InProgress;
        if (state === State.Failed) return State.Failed;
        if (state === State.Invalid) return State.Invalid;
        if (state === State.Pending || state === State.PendingForced) return State.Pending;
        if (state === State.Unknown) return State.Unknown;
        if (state === State.Finished) return State.Finished;
    }

    return State.NoChange;
}
