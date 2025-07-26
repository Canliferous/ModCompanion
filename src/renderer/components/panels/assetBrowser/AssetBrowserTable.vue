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
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import AssetTypeIcon from "~/components/common/AssetTypeIcon.vue";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import { exploreToMca, openMca } from "~/helper/AssetHelper.js";
import AssetBrowserCellName from "~/components/panels/assetBrowser/AssetBrowserCellName.vue";
import AssetBrowserCellConverted from "~/components/panels/assetBrowser/AssetBrowserCellConverted.vue";
import { usePanelsStore } from "~/store/PanelsStore.js";

const listStore = useAssetListStore();
const conversionStore = useAssetConversionStore();

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
    ]);

    if (selected.length === 1) {
        options.push([
            {
                label: "Open .mca",
                onSelect(e: Event) {
                    openMca(selected[0]);
                },
                icon: "tdesign:file-code-1-filled",
            },
            {
                label: "Explore to .mca",
                onSelect(e: Event) {
                    exploreToMca(selected[0]);
                },
                icon: "tdesign:folder-1-filled",
            },
        ]);
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
