import { defineStore } from "pinia";
import { SharedAsset, SharedAssetHash } from "../../shared/SharedAsset.js";
import { ref } from "vue";

export const useAssetListStore = defineStore("asset-list", () => {
    const assets = ref(new Map<SharedAssetHash, SharedAsset>());

    window.electronAPI.asset.subscribeRescanned((event) => {
        assets.value = event.assets;
    });

    return { assets };
});
