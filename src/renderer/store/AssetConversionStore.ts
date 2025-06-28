import { defineStore } from "pinia";
import { SharedConversion, SharedConversionState } from "Shared/SharedConversion.js";
import { SharedAssetHash } from "Shared/SharedAsset.js";

export const useAssetConversionStore = defineStore("asset-conversion", () => {
    const conversions = ref<Map<SharedAssetHash, SharedConversion>>(new Map());

    window.electronAPI.conversion.subscribeUpdated((event) => {
        conversions.value = event.conversions;
    });

    window.electronAPI.conversion.startAgent();

    function getState(hash: SharedAssetHash): SharedConversionState {
        return conversions.value.get(hash)?.state ?? SharedConversionState.Unknown;
    }

    return { getState };
});
