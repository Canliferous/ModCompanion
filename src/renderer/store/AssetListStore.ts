import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useAssetsFilter } from "~/composables/useFilter.js";
import { SharedAsset, SharedAssetId, SharedAssetType } from "Shared/SharedAssetDefinition.js";
import { useRouter } from "vue-router";
import { SharedCreateAssetReportType } from "Shared/SharedCreateAssetReport.js";
import { getContentRelativePath } from "~/helper/SourceFs.js";
import { useRememberStringArray, useRememberWorkspaceRef } from "~/composables/useRemember.js";
import { useEvent } from "~/composables/useEvent.js";

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

    const activateEvent = useEvent<SharedAssetId | undefined>();
    const selectEvent = useEvent<SharedAssetId[]>();
    const writtenEvent = useEvent<SharedAssetId[]>();

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

    function refresh(): void {
        window.electronAPI.asset.forceRescan();
        refreshing.value = true;
    }

    function activate(id: SharedAssetId | undefined): void {
        activateEvent.call(id);
    }

    function selectByMca(mcaPaths: string[]): void {
        const mcaPathsRel = mcaPaths.map((p) => getContentRelativePath(p));
        const sel: SharedAssetId[] = [];
        for (let asset of assets.value.values()) {
            if (asset.defFilePath === undefined) continue;
            if (mcaPathsRel.includes(asset.defFilePath)) {
                sel.push(asset.def.id);
            }
        }

        if (sel.length === 0) return;

        activateEvent.call(sel[0]);
        if (sel.length > 1) {
            selectEvent.call(sel);
        }
    }

    function getAssetById(id: SharedAssetId): SharedAsset | undefined {
        return assets.value.get(id);
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
        writtenEvent.call(as.map((a) => a.def.id));
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
        getAssetById,
        getAssetsById,
        refresh,
        activate,
        selectByMca,
        activateEvent,
        selectEvent,
        writtenEvent,
    };
});
