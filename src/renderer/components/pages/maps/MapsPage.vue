<template>
    <div class="h-full grid grid-rows-[auto_minmax(0,_1fr)] grid-cols-1 gap-1">
        <div class="flex gap-2">
            <UButton
                :leading-icon="mapDrawerOpen ? 'tdesign:chevron-up' : 'tdesign:chevron-down'"
                variant="subtle"
                label="Browse"
                @click="
                    () => {
                        mapDrawerOpen = !mapDrawerOpen;
                    }
                "
            />
            <UInput placeholder="Search" block v-model="searchTerm" leading-icon="tdesign:search" />

            <div class="mx-auto">
                <PlayPauseStopControls v-model="compileState" />
            </div>

            <UButton
                :leading-icon="consoleDrawerOpen ? 'tdesign:chevron-up' : 'tdesign:chevron-down'"
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
            <div v-show="mapDrawerOpen" class="w-80 bg-primary/10 border-primary-800 border-1 overflow-y-auto">
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
                                icon="tdesign:arrow-right"
                                variant="ghost"
                                @click="addMap(item.vmfPath)"
                            />
                        </div>
                    </template>
                </UTree>
            </div>

            <div class="grow overflow-x-auto">
                <MapsDataGrid :mapPaths="mapPaths" />
            </div>

            <div v-show="consoleDrawerOpen" class="w-100 bg-secondary/10 border-secondary-800 border-1"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { TableColumn } from "@nuxt/ui/components/Table.vue.js";
import UCheckbox from "@nuxt/ui/components/Checkbox.vue";
import { computed, h, onBeforeMount, ref } from "vue";
import { useFilter } from "../../../composables/useFilter.js";
import { filename } from "pathe/utils";
import pathe from "pathe";
import { TreeItem } from "@nuxt/ui/components/Tree.vue.js";
import { watchDeep } from "@vueuse/core";
import PlayPauseStopControls from "../../common/PlayPauseStopControls.vue";
import { State as PlayPauseStopControlsState } from "../../common/PlayPauseStopControls.model.js";
import MapsDataGrid from "./MapsDataGrid.vue";

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

const mapPaths = ref<string[]>([]);

function isMapAdded(mapName: string) {
    return mapPaths.value.includes(mapName);
}

function addMap(mapName: string) {
    if (isMapAdded(mapName)) return;

    mapPaths.value.push(mapName);
}

watchDeep(mapPaths, (m) => {
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

    mapPaths.value = maplistAny as string[];
    console.log("Successfully loaded maplist from local storage");
});
</script>

<style scoped></style>
