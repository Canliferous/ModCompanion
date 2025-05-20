<template>
    <div class="h-full grid grid-rows-[auto_minmax(0,_1fr)] gap-1">
        <div class="flex gap-2">
            <UButton
                :leading-icon="mapDrawerOpen ? 'i-bx-caret-up' : 'i-bx-caret-down'"
                variant="subtle"
                label="Add Maps"
                @click="
                    () => {
                        mapDrawerOpen = !mapDrawerOpen;
                    }
                "
            />
            <UInput placeholder="Search" block v-model="searchTerm" />
        </div>
        <div class="flex flex-row gap-1">
            <div v-show="mapDrawerOpen" class="w-80 bg-primary/10 border-primary-800 border-1 rounded overflow-y-auto">
                <UTree
                    :items="drawerTree"
                    color="primary"
                    size="sm"
                    :ui="{
                        listWithChildren: 'border-primary-800',
                        itemWithChildren: 'p-0',
                        link: 'border-b-1 border-primary-800',
                    }"
                >
                    <template #item-trailing="{ item }">
                        <div v-if="isMapTreeItem(item)">
                            <UButton
                                :class="{ invisible: isMapAdded(item.vmfPath) }"
                                icon="i-bx-plus"
                                variant="ghost"
                                size="sm"
                                @click="addMap(item.vmfPath)"
                            />
                        </div>
                    </template>
                </UTree>
            </div>
            <UTable
                class="grow"
                :columns="columns"
                :data="tableItems"
                :ui="{
                    tbody: 'map-table-tbody',
                }"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { TableColumn } from "@nuxt/ui/components/Table.vue.js";
import { MapItem } from "../../model/MapItem.js";
import UCheckbox from "@nuxt/ui/components/Checkbox.vue";
import { computed, h, ref } from "vue";
import { useFilter } from "../../composables/useFilter.js";
import { filename } from "pathe/utils";
import pathe from "pathe";
import { TreeItem } from "@nuxt/ui/components/Tree.vue.js";

interface MapTreeItem extends TreeItem {
    // Relative to map source dir
    vmfPath: string;
}

function isMapTreeItem(item: TreeItem): item is MapTreeItem {
    return (item as any).vmfPath !== undefined;
}

const searchTerm = ref("");

const mapDrawerOpen = ref(false);

const drawerTree = ref<any[]>([]);

async function loadDrawerTree() {
    const mapDirs = await window.electronAPI.listMapSourceDirs();
    drawerTree.value = mapDirs.map<TreeItem>((d) => ({
        label: d.dirName,
        children: d.vmfNames.map<MapTreeItem>((m) => ({
            label: filename(m),
            vmfPath: pathe.join(d.dirName, m),
        })),
    }));
}
loadDrawerTree();

const maps = ref(["map1", "map2", "map3"]);

const items = computed(() => maps.value.map<MapItem>((m) => ({ mapName: m, enabled: true })));

function isMapAdded(mapName: string) {
    return maps.value.includes(mapName);
}

function addMap(mapName: string) {
    if (isMapAdded(mapName)) return;

    maps.value.push(mapName);
}

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
