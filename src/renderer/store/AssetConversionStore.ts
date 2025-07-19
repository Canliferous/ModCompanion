import { defineStore } from "pinia";
import { SharedConversion, SharedConversionState } from "Shared/SharedConversion.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

export const useAssetConversionStore = defineStore("asset-conversion", () => {
    const conversions = ref<Map<SharedAssetId, SharedConversion>>(new Map());

    window.electronAPI.conversion.subscribeUpdated((event) => {
        conversions.value = event.conversions;
    });

    window.electronAPI.conversion.startAgent();

    function getState(id: SharedAssetId): SharedConversionState {
        return conversions.value.get(id)?.state ?? SharedConversionState.Unknown;
    }

    function enqueue(id: SharedAssetId): void {
        window.electronAPI.conversion.enqueue(id);
    }

    return { getState, enqueue };
});
