import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useAssetsFilter } from "~/composables/useFilter.js";
import { useEvent } from "~/composables/useEvent.js";
import { getContentRelativePath } from "~/helper/SourceFs.js";
import { useRememberStringArray, useRememberWorkspaceRef } from "~/composables/useRemember.js";
import { Logger } from "~/logger.js";
import * as Shared from "mod_companion_shared";

export const useAssetListStore = defineStore("asset-list", () => {
    const assets = ref<Map<Shared.Asset.AssetId, Shared.Asset.SharedAsset>>(new Map());
    const potentialAssets = ref<Shared.Asset.SharedAsset[]>([]);
    const refreshing = ref(false);
    const searchTerm = useRememberWorkspaceRef(ref(""), "asset-list-search");
    const assetsEntries = computed(() => [...assets.value.values()]);
    const typeFilter = useRememberStringArray(ref<Shared.Asset.Type[]>([]), "asset-list-types");
    const filteredAssets = useAssetsFilter(assetsEntries, searchTerm, typeFilter);
    const activeId = ref<Shared.Asset.AssetId | undefined>();
    const activeAsset = computed(() => (activeId.value ? assets.value.get(activeId.value) : undefined));
    const selectedIds = ref<Shared.Asset.AssetId[]>([]);
    const selectedAssets = computed(() =>
        filteredAssets.value.filter((value) => selectedIds.value.includes(value.def.id)),
    );

    const activateEvent = useEvent<Shared.Asset.AssetId | undefined>();
    const selectEvent = useEvent<Shared.Asset.AssetId[]>();
    const writtenEvent = useEvent<Shared.Asset.AssetId[]>();

    window.electronAPI.asset.subscribeRescanned((event) => {
        assets.value = event.assets;
        potentialAssets.value = event.potentialAssets;
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
        for (const asset of newAssets) {
            assets.value.set(asset.def.id, asset);
        }
    });

    window.electronAPI.asset.subscribeNavigateToHash((assetId) => {
        activeId.value = assetId;
    });

    async function createAsset(primaryFile: string, otherFiles: string[]): Promise<Shared.Asset.SharedAsset[]> {
        const result = await window.electronAPI.asset.createAsset(primaryFile, otherFiles);
        if (result.type === Shared.Asset.SharedCreateAssetReportType.Success) {
            for (const asset of result.assets) {
                assets.value.set(asset.def.id, asset);
            }

            return result.assets;
        }

        return [];
    }

    async function deleteAsset(assetId: Shared.Asset.AssetId): Promise<boolean> {
        try {
            await window.electronAPI.asset.delete(assetId);
        } catch {
            return false;
        }

        assets.value.delete(assetId);
        if (activeId.value === assetId) {
            activeId.value = undefined;
        }

        const selectedIdx = selectedIds.value.indexOf(assetId);
        if (selectedIdx !== -1) {
            selectedIds.value = selectedIds.value.toSpliced(selectedIdx, 1);
        }
        return true;
    }

    function refresh(): void {
        window.electronAPI.asset.forceRescan();
        refreshing.value = true;
    }

    function activate(id: Shared.Asset.AssetId | undefined): void {
        activateEvent.call(id);
    }

    function selectByMca(mcaPaths: string[]): void {
        const mcaPathsRel = mcaPaths.map((p) => getContentRelativePath(p));
        const sel: Shared.Asset.AssetId[] = [];
        for (const asset of assets.value.values()) {
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

    function getAssetById(id: Shared.Asset.AssetId | undefined): Shared.Asset.SharedAsset | undefined {
        if (id === undefined) return undefined;
        return assets.value.get(id);
    }

    function getAssetsById(ids: Shared.Asset.AssetId[]): Shared.Asset.SharedAsset[] {
        return ids.map((id) => assets.value.get(id)).filter((a) => a !== undefined);
    }

    function updateAssets(as: Shared.Asset.SharedAsset[]): void {
        const mapCopy = new Map(assets.value);
        for (const a of as) {
            mapCopy.set(a.def.id, a);
        }
        assets.value = mapCopy;
    }

    async function writeAssets(as: Shared.Asset.SharedAsset[]): Promise<void> {
        Logger.debug(Shared.Log.Channel.Generic, "Writing asset", as);
        const results = as.map((a) => window.electronAPI.asset.update(a.def.id, a.def));
        const newAssets = await Promise.all(results);
        const filtered = newAssets.filter((n) => n !== undefined);
        updateAssets(filtered);
        writtenEvent.call(as.map((a) => a.def.id));
    }

    return {
        assets,
        potentialAssets,
        refreshing,
        searchTerm,
        filteredAssets,
        activeId,
        activeAsset,
        selectedIds,
        selectedAssets,
        typeFilter,
        createAsset,
        deleteAsset,
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
