import { SharedConversionEvent, SharedConversionState } from "Shared/SharedConversion.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

export const ConversionEventSystem = {
    conversionEvents: [] as SharedConversionEvent[],

    pushNewEvent(assetId: SharedAssetId, startTime: Date, initialState: SharedConversionState) {
        this.conversionEvents.push({
            assetId,
            stateHistory: [initialState],
            startTime,
            log: "",
        });
    },
    getLatestEvent(assetId: SharedAssetId): SharedConversionEvent | undefined {
        return this.conversionEvents.findLast((a) => a.assetId === assetId);
    },
    updateLatestEvent(assetId: SharedAssetId, updatePredicate: (event: SharedConversionEvent) => void): void {
        const event = this.getLatestEvent(assetId);
        if (event) {
            updatePredicate(event);
        }
    },
    clearEvents(): void {
        ConversionEventSystem.conversionEvents = [];
    },
};
