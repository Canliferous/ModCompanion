import { defineStore } from "pinia";
import { SharedConversion, SharedConversionState } from "Shared/SharedConversion.js";
import { SharedAssetId } from "Shared/SharedAsset.js";

export const useAssetConversionStore = defineStore("asset-conversion", () => {
    const conversions = ref<Map<SharedAssetId, SharedConversion>>(new Map());

    window.electronAPI.conversion.subscribeUpdated((event) => {
        conversions.value = event.conversions;
    });

    window.electronAPI.conversion.startAgent();

    function getState(hash: SharedAssetId): SharedConversionState {
        return conversions.value.get(hash)?.state ?? SharedConversionState.Unknown;
    }

    return { getState };
});
