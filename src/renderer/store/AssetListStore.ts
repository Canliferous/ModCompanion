import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useAssetsFilter } from "~/composables/useFilter.js";
import { SharedAsset, SharedAssetHash } from "Shared/SharedAsset.js";
import { useRouter } from "vue-router";

export const useAssetListStore = defineStore("asset-list", () => {
    const assets = ref(new Map<SharedAssetHash, SharedAsset>());
    const refreshing = ref(false);
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
        if (event.totalTimeMillis) {
            const seconds = (event.totalTimeMillis * 0.001).toFixed(2);
            toast.add({
                title: "Asset scan complete",
                description: `Scanned ${assetCount} assets in ${seconds}s`,
                icon: "tdesign:task-checked-1",
                color: "success",
            });
        } else {
            toast.add({
                title: "Scan complete",
                description: `Scanned ${assetCount} assets`,
                icon: "tdesign:task-checked-1",
                color: "success",
            });
        }
    });

    window.electronAPI.asset.subscribeAdded((event) => {
        const newAssets = event.assets;
        if (newAssets.length === 0) return;

        for (const newAsset of newAssets) {
            assets.value.set(newAsset.hash, newAsset);
        }

        const toast = useToast();
        const assetList = newAssets.map((a) => `+ ${a.displayName}`).join("\n");
        toast.add({
            title: "Assets added",
            description: assetList,
            icon: "tdesign:task-add-1",
            color: "success",
        });
    });

    window.electronAPI.asset.subscribeUpdated((event) => {
        const newAssets = event.assets;
        for (let asset of newAssets) {
            assets.value.set(asset.hash, asset);
        }

        const toast = useToast();
        const assetList = newAssets.map((a) => `~ ${a.displayName}`).join("\n");
        toast.add({
            title: "Assets updated",
            description: assetList,
            icon: "tdesign:task-add-1",
            color: "success",
        });
    });

    window.electronAPI.asset.subscribeNavigateToHash((assetHash) => {
        selectedAssetHash.value = assetHash;
        const router = useRouter();
        router.push("/assets");
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
