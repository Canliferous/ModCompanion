<template>
    <UContextMenu :items="items">
        <DataTable
            ref="table"
            :entries="entries"
            :columns="columns"
            @onActiveChanged="handleActiveChanged"
            @onSelectionChanged="handleSelectionChanged"
            tree
            :tree-child-func="treeChildFunc"
        />
    </UContextMenu>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { DataTableColumn } from "~/components/common/DataTable/DataTable.model.js";
import {
    getAssociatedEntryName,
    SharedAssetDefinitionAssociatedFiles,
    SharedAssetId,
} from "Shared/SharedAssetDefinition.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import AssetTypeIcon from "~/components/common/AssetTypeIcon.vue";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import { exploreToMca, openAssociatedFile, openMca } from "~/helper/AssetHelper.js";
import AssetBrowserCellAssetName from "~/components/panels/assetBrowser/AssetBrowserCellAssetName.vue";
import AssetBrowserCellConverted from "~/components/panels/assetBrowser/AssetBrowserCellConverted.vue";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import {
    AssetBrowserAssetEntry,
    AssetBrowserEntry,
    AssetBrowserEntryTypes,
    getAssetBrowserEntrySortString,
    isAssetBrowserAssetEntry,
    isAssetBrowserGroupEntry,
} from "~/components/panels/assetBrowser/AssetBrowser.model.js";
import AssetBrowserCellGroupName from "~/components/panels/assetBrowser/AssetBrowserCellGroupName.vue";

const listStore = useAssetListStore();
const conversionStore = useAssetConversionStore();
const assetGroupsStore = useAssetGroupsStore();

const table = useTemplateRef("table");

const entries = computed(() => {
    const assetGroups = assetGroupsStore.groups;
    const assetIdsInGroups: SharedAssetId[] = [];

    // Add groups first
    const result: AssetBrowserEntry[] = [];
    for (const assetGroup of assetGroups) {
        result.push({
            type: AssetBrowserEntryTypes.Group,
            group: assetGroup,
        });

        assetIdsInGroups.push(...assetGroup.assets);
    }

    // Add remaining ungrouped assets
    for (let assets of listStore.filteredAssets) {
        if (assetIdsInGroups.includes(assets.def.id)) {
            continue;
        }

        result.push({
            type: AssetBrowserEntryTypes.Asset,
            assetDef: assets.def,
        });
    }

    result.sort((a, b) => getAssetBrowserEntrySortString(a).localeCompare(getAssetBrowserEntrySortString(b)));

    return result;
});

// TODO: Also update active
listStore.subscribeSelectionUpdated(() => {
    const selIds = listStore.selectedIds;

    const assets = listStore.filteredAssets;
    const selIdxs = selIds.map((s) => assets.findIndex((v) => v.def.id === s));
    table.value?.select(selIdxs);
});

function treeChildFunc(entry: AssetBrowserEntry): AssetBrowserEntry[] | undefined {
    if (isAssetBrowserGroupEntry(entry)) {
        const assets = listStore.getAssetsById(entry.group.assets);
        const entries = assets.map<AssetBrowserAssetEntry>((a) => ({
            type: AssetBrowserEntryTypes.Asset,
            assetDef: a.def,
        }));
        return entries;
    }

    return undefined;
}

const columns: DataTableColumn<AssetBrowserEntry>[] = [
    {
        id: "name",
        label: "Name",
        cell: (entry, depth) => {
            if (isAssetBrowserAssetEntry(entry)) {
                return h(AssetBrowserCellAssetName, {
                    name: entry.assetDef.displayName ?? "(unknown)",
                    type: entry.assetDef.type,
                    depth,
                });
            } else if (isAssetBrowserGroupEntry(entry)) {
                return h(AssetBrowserCellGroupName, { name: entry.group.displayName });
            }

            return undefined;
        },
        size: "minmax(0, 1fr)",
    },
    {
        id: "converted",
        label: "Conv",
        cell: (entry) => {
            if (isAssetBrowserAssetEntry(entry)) {
                const state = conversionStore.getState(entry.assetDef.id);
                return h(AssetBrowserCellConverted, { state });
            }
        },
        size: "auto",
    },
];

function handleSelectionChanged(entries: AssetBrowserEntry[]): void {
    listStore.selectAssetsById(entries.filter(isAssetBrowserAssetEntry).map((a) => a.assetDef.id));
}

function handleActiveChanged(entry: AssetBrowserEntry | undefined): void {
    if (isAssetBrowserAssetEntry(entry)) {
        listStore.activateAssetById(entry.assetDef.id);
    }
}

const items = computed(() => {
    const selected = listStore.selectedAssets;
    const options: ContextMenuItem[][] = [];
    if (selected.length === 0) return;

    options.push([
        {
            label: "Convert",
            onSelect(e) {
                for (const sel of selected) {
                    conversionStore.enqueue(sel.def.id);
                }
            },
            icon: "tdesign:forward-filled",
            color: "success",
        },
        {
            label: "Create Asset Group",
            onSelect(e: Event) {
                assetGroupsStore.createGroup(selected.map((s) => s.def.id));
            },
            icon: "tdesign:app-filled",
            color: "success",
        },
    ]);

    if (selected.length === 1) {
        const sel = selected[0];
        options.push([
            {
                label: "Open .mca",
                onSelect(e: Event) {
                    openMca(sel);
                },
                icon: "tdesign:file-code-1-filled",
            },
            {
                label: "Explore to .mca",
                onSelect(e: Event) {
                    exploreToMca(sel);
                },
                icon: "tdesign:folder-1-filled",
            },
        ]);

        if (sel.def.associatedFiles) {
            const ass = sel.def.associatedFiles;
            for (const assKey in ass) {
                const key = assKey as keyof SharedAssetDefinitionAssociatedFiles;
                const v = ass[key];
                if (v) {
                    const entry = getAssociatedEntryName(key)!;
                    options.push([
                        {
                            label: `Open ${entry.name}`,
                            onSelect(e: Event) {
                                openAssociatedFile(v);
                            },
                            icon: entry.icon,
                        },
                    ]);
                }
            }
        }
    }

    options.push([
        {
            label: `${selected.length} selected`,
            disabled: true,
            icon: "a", // Empty icon
        },
    ]);

    return options;
});
</script>

<style scoped></style>
