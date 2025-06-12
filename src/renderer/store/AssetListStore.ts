import { defineStore } from "pinia";
import { SharedAsset, SharedAssetHash } from "../../shared/SharedAsset.js";
import { computed, ref } from "vue";
import { useAssetsFilter } from "../composables/useFilter.js";

export const useAssetListStore = defineStore("asset-list", () => {
    const assets = ref(new Map<SharedAssetHash, SharedAsset>());
    const refreshing = ref(true);
    const searchTerm = ref("");
    const assetsEntries = computed(() => [...assets.value.values()]);
    const filteredAssets = useAssetsFilter(assetsEntries, searchTerm);
    const selectedAssetHash = ref("");
    const selectedAsset = computed(() => assets.value.get(selectedAssetHash.value));

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

    function forceRefresh(): void {
        window.electronAPI.asset.forceRescan();
        refreshing.value = true;
    }

    function selectAsset(assetHash: string): void {
        selectedAssetHash.value = assetHash;
    }

    return {
        assets,
        refreshing,
        forceRefresh,
        searchTerm,
        filteredAssets,
        selectedAssetHash,
        selectAsset,
        selectedAsset,
    };
});
