import { defineStore } from "pinia";
import { SharedAsset, SharedAssetHash } from "../../shared/SharedAsset.js";
import { ref } from "vue";

export const useAssetListStore = defineStore("asset-list", () => {
    const assets = ref(new Map<SharedAssetHash, SharedAsset>());
    const refreshing = ref(true);

    window.electronAPI.asset.subscribeRescanned((event) => {
        assets.value = event.assets;
        refreshing.value = false;

        const toast = useToast();
        const assetCount = event.assets.size;
        const seconds = (event.totalTimeMillis * 0.001).toFixed(2);
        toast.add({
            title: "Scan complete",
            description: `Scanned ${assetCount} assets in ${seconds}s`,
            icon: "tdesign:task-checked-1",
            color: "success",
        });
    });

    function forceRefresh() {
        window.electronAPI.asset.forceRescan();
        refreshing.value = true;
    }

    return { assets, refreshing, forceRefresh };
});
