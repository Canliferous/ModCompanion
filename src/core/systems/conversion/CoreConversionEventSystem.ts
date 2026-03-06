import * as Shared from "mod_companion_shared";

export const ConversionEventSystem = {
    conversionEvents: [] as Shared.Conversion.ConversionEvent[],
    lastChangeTime: undefined as Date | undefined,

    pushNewEvent(assetId: Shared.Asset.AssetId, startTime: Date, initialState: Shared.Conversion.State) {
        this.conversionEvents.push({
            assetId,
            stateHistory: [initialState],
            startTime,
            log: "",
        });

        this.lastChangeTime = new Date();
    },
    getLatestEvent(assetId: Shared.Asset.AssetId): Shared.Conversion.ConversionEvent | undefined {
        return this.conversionEvents.findLast((a) => a.assetId === assetId);
    },
    updateLatestEvent(
        assetId: Shared.Asset.AssetId,
        updatePredicate: (event: Shared.Conversion.ConversionEvent) => void,
    ): void {
        const event = this.getLatestEvent(assetId);
        if (event) {
            updatePredicate(event);
        }
        this.lastChangeTime = new Date();
    },
    clearEvents(): void {
        ConversionEventSystem.conversionEvents = [];
        this.lastChangeTime = new Date();
    },
};
