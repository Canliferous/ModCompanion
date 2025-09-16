import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useAssetsFilter } from "~/composables/useFilter.js";
import { SharedAsset, SharedAssetId, SharedAssetType } from "Shared/SharedAssetDefinition.js";
import { useRouter } from "vue-router";
import { SharedCreateAssetReportType } from "Shared/SharedCreateAssetReport.js";
import { getContentRelativePath } from "~/helper/SourceFs.js";
import { useRememberRef, useRememberStringArray, useRememberWorkspaceRef } from "~/composables/useRemember.js";

export const useAssetListStore = defineStore("asset-list", () => {
    const assets = ref<Map<SharedAssetId, SharedAsset>>(new Map<SharedAssetId, SharedAsset>());
    const refreshing = ref(false);
    const searchTerm = useRememberWorkspaceRef(ref(""), "asset-list-search");
    const assetsEntries = computed(() => [...assets.value.values()]);
    const typeFilter = useRememberStringArray(ref<SharedAssetType[]>([]), "asset-list-types");
    const filteredAssets = useAssetsFilter(assetsEntries, searchTerm, typeFilter);
    const activeId = ref<SharedAssetId | undefined>();
    const activeAsset = computed(() => (activeId.value ? assets.value.get(activeId.value) : undefined));
    const selectedIds = ref<SharedAssetId[]>([]);

    const selectedAssets = computed(() =>
        filteredAssets.value.filter((value, index) => selectedIds.value.includes(value.def.id)),
    );

    type SelectionUpdatedFunc = () => void;
    const selectionUpdatedSubscribers: SelectionUpdatedFunc[] = [];
    function subscribeSelectionUpdated(func: SelectionUpdatedFunc) {
        selectionUpdatedSubscribers.push(func);
    }
    function notifySelectionUpdated() {
        for (let sub of selectionUpdatedSubscribers) {
            sub();
        }
    }

    type AssetsWrittenFunc = (assetIds: SharedAssetId[]) => void;
    const assetsWrittenSubscribers: AssetsWrittenFunc[] = [];
    function subscribeAssetsWritten(func: AssetsWrittenFunc) {
        assetsWrittenSubscribers.push(func);
    }
    function notifyAssetsWritten(assetIds: SharedAssetId[]) {
        for (let sub of assetsWrittenSubscribers) {
            sub(assetIds);
        }
    }

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
        activeId.value = assetHash;
        const router = useRouter();
        router.push("/assets");
    });

    async function createAsset(primaryFile: string, otherFiles: string[]): Promise<void> {
        const result = await window.electronAPI.asset.createAsset(primaryFile, otherFiles);
        if (result.type === SharedCreateAssetReportType.Success) {
            for (const asset of result.assets) {
                assets.value.set(asset.def.id, asset);
            }
        }
    }

    function forceRefresh(): void {
        window.electronAPI.asset.forceRescan();
        refreshing.value = true;
    }

    function activateAssetById(assetHash: string | undefined): void {
        activeId.value = assetHash;
    }

    function activateAssetByIndex(idx: number | undefined): void {
        if (idx === undefined) {
            activeId.value = undefined;
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
        selectedIds.value = idxs.map((i) => getIdByIndex(i)).filter((i) => i !== undefined);
    }

    function selectAssetsById(assets: SharedAssetId[]): void {
        selectedIds.value = assets;
    }

    function selectAssetsByMca(mcaPaths: string[]): void {
        const mcaPathsRel = mcaPaths.map((p) => getContentRelativePath(p));
        const sel: SharedAssetId[] = [];
        for (let asset of assets.value.values()) {
            if (asset.defFilePath === undefined) continue;
            if (mcaPathsRel.includes(asset.defFilePath)) {
                sel.push(asset.def.id);
            }
        }

        activeId.value = undefined;
        selectedIds.value = sel;
        notifySelectionUpdated();
    }

    function getAssetByIndex(idx: number): SharedAsset | undefined {
        if (idx < 0) return undefined;
        const arr = filteredAssets.value;
        if (idx > arr.length - 1) return undefined;
        return arr[idx];
    }

    function getAssetsById(ids: SharedAssetId[]): SharedAsset[] {
        return ids.map((id) => assets.value.get(id)).filter((a) => a !== undefined);
    }

    function updateAssets(as: SharedAsset[]): void {
        const mapCopy = new Map(assets.value);
        for (const a of as) {
            mapCopy.set(a.def.id, a);
        }
        assets.value = mapCopy;
    }

    async function writeAssets(as: SharedAsset[]): Promise<void> {
        const results = as.map((a) => window.electronAPI.asset.update(a.def.id, a.def));
        let newAssets = await Promise.all(results);
        const filtered = newAssets.filter((n) => n !== undefined);
        updateAssets(filtered);
        notifyAssetsWritten(as.map((a) => a.def.id));
    }

    return {
        assets,
        refreshing,
        searchTerm,
        filteredAssets,
        activeId,
        activeAsset,
        selectedIds,
        selectedAssets,
        typeFilter,
        createAsset,
        writeAssets,
        getAssetByIndex,
        getAssetsById,
        forceRefresh,
        activateAssetById,
        activateAssetByIndex,
        selectIndices,
        selectAssetsById,
        selectAssetsByMca,
        subscribeSelectionUpdated,
        subscribeAssetsWritten,
    };
});
