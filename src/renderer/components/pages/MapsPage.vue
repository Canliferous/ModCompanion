<template>
    <div>
        <div class="flex">
            <UInput placeholder="Search" block v-model="searchTerm" />
        </div>
        <UTable
            :columns="columns"
            :data="tableItems"
            :ui="{
                tbody: 'map-table-tbody',
            }"
        />
    </div>
</template>

<script setup lang="ts">
import { TableColumn } from "@nuxt/ui/components/Table.vue.js";
import { MapItem } from "../../model/MapItem.js";
import UCheckbox from "@nuxt/ui/components/Checkbox.vue";
import { h, ref } from "vue";
import { useFilter } from "../../composables/useFilter.js";

// window.electronAPI.listMapSourceDirs().then((d) => console.log(d));

const searchTerm = ref("");

const items = ref([
    {
        mapName: "map1",
        enabled: false,
    },
    {
        mapName: "map2",
        enabled: false,
    },
    {
        mapName: "map3",
        enabled: false,
    },
] as MapItem[]);

const columns: TableColumn<MapItem>[] = [
    {
        accessorKey: "enabled",
        header: ({ table }) =>
            h(UCheckbox, {
                modelValue: table.getIsSomePageRowsSelected() ? "indeterminate" : table.getIsAllPageRowsSelected(),
                "onUpdate:modelValue": (value: boolean | "indeterminate") => table.toggleAllPageRowsSelected(!!value),
                "aria-label": "Select all",
            }),
        cell: ({ row }) =>
            h(UCheckbox, {
                modelValue: row.getIsSelected(),
                "onUpdate:modelValue": (value: boolean | "indeterminate") => row.toggleSelected(!!value),
                "aria-label": "Select row",
            }),
    },
    {
        accessorKey: "mapName",
        header: "Name",
    },
];

const tableItems = useFilter(items, (i) => i.mapName, searchTerm);

// useSortable(".map-table-tbody", items, {
//     animation: 150,
// });
</script>

<style scoped></style>
