import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useAssetsFilter } from "~/composables/useFilter.js";
import { SharedAsset, SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { useRouter } from "vue-router";
import { SharedCreateAssetReportType } from "Shared/SharedCreateAssetReport.js";

export const useAssetListStore = defineStore("asset-list", () => {
    const assets = ref<Map<SharedAssetId, SharedAsset>>(new Map<SharedAssetId, SharedAsset>());
    const refreshing = ref(false);
    const searchTerm = ref("");
    const assetsEntries = computed(() => [...assets.value.values()]);
    const filteredAssets = useAssetsFilter(assetsEntries, searchTerm);
    const activeAssetId = ref<SharedAssetId | undefined>();
    const activeAsset = computed(() => (activeAssetId.value ? assets.value.get(activeAssetId.value) : undefined));
    const selectedIndices = ref<number[]>([]);

    const selectedAssets = computed(() =>
        filteredAssets.value.filter((value, index) => selectedIndices.value.includes(index)),
    );

    window.electronAPI.asset.subscribeRescanned((event) => {
        assets.value = event.assets;
        refreshing.value = false;
    });

    window.electronAPI.asset.subscribeAdded((event) => {
        const newAssets = event.assets;
        if (newAssets.length === 0) return;

        for (const newAsset of newAssets) {
            assets.value.set(newAsset.def.id, newAsset);
        }
    });

    window.electronAPI.asset.subscribeUpdated((event) => {
        const newAssets = event.assets;
        for (let asset of newAssets) {
            assets.value.set(asset.def.id, asset);
        }
    });

    window.electronAPI.asset.subscribeNavigateToHash((assetHash) => {
        activeAssetId.value = assetHash;
        const router = useRouter();
        router.push("/assets");
    });

    async function createAsset(files: string[]): Promise<void> {
        const result = await window.electronAPI.asset.createAsset(files);
        if (result.type === SharedCreateAssetReportType.Success) {
            assets.value.set(result.asset.def.id, result.asset);
        }
    }

    function forceRefresh(): void {
        window.electronAPI.asset.forceRescan();
        refreshing.value = true;
    }

    function activateAssetById(assetHash: string): void {
        activeAssetId.value = assetHash;
    }

    function activateAssetByIndex(idx: number | undefined): void {
        if (idx === undefined) {
            activeAssetId.value = undefined;
            return;
        }

        const id = getIdByIndex(idx);
        if (id !== undefined) {
            activateAssetById(id);
        }
    }

    function getIdByIndex(idx: number): SharedAssetId | undefined {
        if (idx < 0) return undefined;
        const arr = filteredAssets.value;
        if (idx > arr.length - 1) return undefined;
        return arr[idx].def.id;
    }

    function selectIndices(idxs: number[]): void {
        selectedIndices.value = idxs;
    }

    function getAssetByIndex(idx: number): SharedAsset | undefined {
        if (idx < 0) return undefined;
        const arr = filteredAssets.value;
        if (idx > arr.length - 1) return undefined;
        return arr[idx];
    }

    return {
        assets,
        refreshing,
        searchTerm,
        filteredAssets,
        activeAssetId,
        activeAsset,
        selectedIndices,
        selectedAssets,
        createAsset,
        getAssetByIndex,
        forceRefresh,
        activateAssetById,
        activateAssetByIndex,
        selectIndices,
    };
});
