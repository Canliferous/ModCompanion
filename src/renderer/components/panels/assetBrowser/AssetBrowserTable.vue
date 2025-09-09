<template>
    <UContextMenu :items="items">
        <DataTable
            ref="table"
            :entries="listStore.filteredAssets"
            :columns="columns"
            @onActiveChanged="handleActiveChanged"
            @onSelectionChanged="handleSelectionChanged"
        />
    </UContextMenu>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { DataTableColumn } from "~/components/common/DataTable/DataTable.model.js";
import {
    getAssociatedEntryName,
    SharedAsset,
    SharedAssetDefinitionAssociatedFiles,
} from "Shared/SharedAssetDefinition.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import AssetTypeIcon from "~/components/common/AssetTypeIcon.vue";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import { exploreToMca, openAssociatedFile, openMca } from "~/helper/AssetHelper.js";
import AssetBrowserCellName from "~/components/panels/assetBrowser/AssetBrowserCellName.vue";
import AssetBrowserCellConverted from "~/components/panels/assetBrowser/AssetBrowserCellConverted.vue";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";

const listStore = useAssetListStore();
const conversionStore = useAssetConversionStore();
const assetGroupsStore = useAssetGroupsStore();

const table = useTemplateRef("table");

// TODO: Also update active
listStore.subscribeSelectionUpdated(() => {
    const selIds = listStore.selectedIds;

    const assets = listStore.filteredAssets;
    const selIdxs = selIds.map((s) => assets.findIndex((v) => v.def.id === s));
    table.value?.select(selIdxs);
});

const columns: DataTableColumn<SharedAsset>[] = [
    {
        id: "type",
        label: "",
        cell: (entry) => h(AssetTypeIcon, { type: entry.def.type }),
        size: "auto",
    },
    {
        id: "name",
        label: "Name",
        cell: (entry) => h(AssetBrowserCellName, { name: entry.def.displayName ?? "(unknown)" }),
        size: "minmax(0, 1fr)",
    },
    {
        id: "converted",
        label: "Conv",
        cell: (entry) => h(AssetBrowserCellConverted, { state: conversionStore.getState(entry.def.id) }),
        size: "auto",
    },
];

function handleSelectionChanged(idxs: number[]): void {
    listStore.selectIndices(idxs);
}

function handleActiveChanged(idx: number | undefined): void {
    listStore.activateAssetByIndex(idx);
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
