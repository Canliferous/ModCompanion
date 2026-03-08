import * as Shared from "mod_companion_shared";

export function summarizeConversionStates(states: Shared.Conversion.State[]): Shared.Conversion.State {
    for (const state of states) {
        if (state === Shared.Conversion.State.InProgress) return Shared.Conversion.State.InProgress;
        if (state === Shared.Conversion.State.Failed) return Shared.Conversion.State.Failed;
        if (state === Shared.Conversion.State.Invalid) return Shared.Conversion.State.Invalid;
        if (state === Shared.Conversion.State.Pending || state === Shared.Conversion.State.PendingForced) return Shared.Conversion.State.Pending;
        if (state === Shared.Conversion.State.Unknown) return Shared.Conversion.State.Unknown;
        if (state === Shared.Conversion.State.Finished) return Shared.Conversion.State.Finished;
    }

    return Shared.Conversion.State.NoChange;
}
