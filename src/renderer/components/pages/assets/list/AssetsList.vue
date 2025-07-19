<template>
    <DataTable
        :entries="listStore.filteredAssets"
        :columns="columns"
        @onActiveChanged="handleActiveChanged"
        @onSelectionChanged="handleSelectionChanged"
    />
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { DataTableColumn } from "~/components/common/DataTable/DataTable.model.js";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import AssetsListCellConverted from "~/components/pages/assets/list/AssetsListCellConverted.vue";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import AssetsListCellName from "~/components/pages/assets/list/AssetsListCellName.vue";
import AssetTypeIcon from "~/components/common/AssetTypeIcon.vue";

const listStore = useAssetListStore();
const conversionStore = useAssetConversionStore();

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
        cell: (entry) => h(AssetsListCellName, { name: entry.def.displayName ?? "(unknown)" }),
        size: "1fr",
    },
    {
        id: "converted",
        label: "Conv",
        cell: (entry) => h(AssetsListCellConverted, { state: conversionStore.getState(entry.def.id) }),
        size: "auto",
    },
];

function handleSelectionChanged(idxs: number[]): void {}

function handleActiveChanged(idx: number | undefined): void {
    listStore.selectAssetByIndex(idx);
}
</script>

<style scoped></style>
