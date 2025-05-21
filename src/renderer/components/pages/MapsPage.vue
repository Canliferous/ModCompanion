<template>
    <div class="h-full grid grid-rows-[auto_minmax(0,_1fr)] gap-1">
        <div class="flex gap-2">
            <UButton
                :leading-icon="mapDrawerOpen ? 'i-bx-caret-up' : 'i-bx-caret-down'"
                variant="subtle"
                label="Browse"
                @click="
                    () => {
                        mapDrawerOpen = !mapDrawerOpen;
                    }
                "
            />
            <UInput placeholder="Search" block v-model="searchTerm" leading-icon="i-bx-search" />

            <div class="mx-auto">
                <PlayPauseStopControls v-model="compileState" />
            </div>

            <UButton
                :leading-icon="consoleDrawerOpen ? 'i-bx-caret-up' : 'i-bx-caret-down'"
                color="secondary"
                variant="subtle"
                label="Output"
                @click="
                    () => {
                        consoleDrawerOpen = !consoleDrawerOpen;
                    }
                "
            />
        </div>
        <div class="flex flex-row gap-1">
            <div v-show="mapDrawerOpen" class="w-80 bg-primary/10 border-primary-800 border-1 rounded overflow-y-auto">
                <UTree
                    :items="drawerTree"
                    color="primary"
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
                                icon="i-bx-right-arrow-alt"
                                variant="ghost"
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
            >
                <template #action-cell="{ row }">
                    <UButton icon="i-bx-play" color="secondary" variant="soft" />
                </template>
                <template #step-bsp-cell="{ row }"><UIcon name="i-lucide-dot" /></template>
                <template #step-post-cell="{ row }"><UIcon name="i-lucide-dot" /></template>
                <template #step-vis-cell="{ row }"><UIcon name="i-lucide-dot" /></template>
                <template #step-rad-cell="{ row }"><UIcon name="i-lucide-dot" /></template>
                <template #step-cubemap-cell="{ row }"><UIcon name="i-lucide-dot" /></template>
                <template #step-summary-cell="{ row }"><UIcon name="i-lucide-dot" /></template>
            </UTable>

            <div v-show="consoleDrawerOpen" class="w-100 bg-secondary/10 border-secondary-800 border-1 rounded"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TableColumn } from "@nuxt/ui/components/Table.vue.js";
import { MapItem } from "../../model/MapItem.js";
import UCheckbox from "@nuxt/ui/components/Checkbox.vue";
import { computed, h, ref, watch, onActivated, onBeforeMount } from "vue";
import { useFilter } from "../../composables/useFilter.js";
import { filename } from "pathe/utils";
import pathe from "pathe";
import { TreeItem } from "@nuxt/ui/components/Tree.vue.js";
import { watchDeep } from "@vueuse/core";
import PlayPauseStopControls from "../common/PlayPauseStopControls.vue";
import { State as PlayPauseStopControlsState } from "../common/PlayPauseStopControls.model.js";

interface MapTreeItem extends TreeItem {
    // Relative to map source dir
    vmfPath: string;
}

function isMapTreeItem(item: TreeItem): item is MapTreeItem {
    return (item as any).vmfPath !== undefined;
}

const searchTerm = ref("");

const mapDrawerOpen = ref(false);
const consoleDrawerOpen = ref(false);

const drawerTree = ref<any[]>([]);

const compileState = ref<PlayPauseStopControlsState>(PlayPauseStopControlsState.Stopped);

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

const maps = ref<string[]>([]);

const items = computed(() => maps.value.map<MapItem>((m) => ({ mapName: m, enabled: true })));

function isMapAdded(mapName: string) {
    return maps.value.includes(mapName);
}

function addMap(mapName: string) {
    if (isMapAdded(mapName)) return;

    maps.value.push(mapName);
}

watchDeep(maps, (m) => {
    localStorage.setItem("maplist", JSON.stringify(m));
});

onBeforeMount(() => {
    console.log("Loading maplist from local storage...");
    const maplistStr = localStorage.getItem("maplist");
    if (!maplistStr) return;

    const maplistAny = JSON.parse(maplistStr);

    if (!Array.isArray(maplistAny)) {
        console.warn("Loading maplist from local storage failed: Value is not array");
        return;
    }

    const somethingNotString = maplistAny.some((m) => typeof m !== "string");
    if (somethingNotString) {
        console.warn("Loading maplist from local storage failed: Some array items are not string");
        return;
    }

    maps.value = maplistAny as string[];
    console.log("Successfully loaded maplist from local storage");
});

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
    {
        id: "step-bsp",
        header: "BSP",
    },
    {
        id: "step-post",
        header: "POST",
    },
    {
        id: "step-vis",
        header: "VIS",
    },
    {
        id: "step-rad",
        header: "RAD",
    },
    {
        id: "step-cubemap",
        header: "Cubemap",
    },
    {
        id: "step-summary",
        header: "Summary",
    },
    {
        id: "action",
        size: 100,
    },
];

const tableItems = useFilter(items, (i) => i.mapName, searchTerm);

// useSortable(".map-table-tbody", items, {
//     animation: 150,
// });
</script>

<style scoped></style>
