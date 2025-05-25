<template>
    <div class="h-full grid grid-rows-[auto_minmax(0,_1fr)] grid-cols-1 gap-1">
        <div class="flex gap-2">
            <UButton
                :leading-icon="mapDrawerOpen ? 'tdesign:chevron-up' : 'tdesign:chevron-down'"
                color="success"
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
            <div v-show="mapDrawerOpen" class="w-80 bg-success/10 border-success-800 border-1 overflow-y-auto">
                <UTree
                    :items="drawerTree"
                    color="success"
                    :ui="{
                        listWithChildren: 'border-success-800',
                        itemWithChildren: 'p-0',
                        link: 'border-b-1 border-success-800',
                    }"
                >
                    <template #item-trailing="{ item }">
                        <div v-if="isMapTreeItem(item)">
                            <UButton
                                :class="{ invisible: isMapAdded(item.vmfPath) }"
                                icon="tdesign:arrow-right"
                                variant="ghost"
                                @click="addMap(item.vmfPath)"
                                color="success"
                            />
                        </div>
                    </template>
                </UTree>
            </div>

            <div class="grow overflow-x-auto">
                <MapsDataGrid :mapPaths="filteredMapPaths" @remove-map="handleRemoveMap" />
            </div>

            <div v-show="consoleDrawerOpen" class="w-100 bg-secondary/10 border-secondary-800 border-1"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { filename } from "pathe/utils";
import pathe from "pathe";
import { TreeItem } from "@nuxt/ui/components/Tree.vue.js";
import PlayPauseStopControls from "../../common/PlayPauseStopControls.vue";
import { State as PlayPauseStopControlsState } from "../../common/PlayPauseStopControls.model.js";
import MapsDataGrid from "./MapsDataGrid.vue";
import { useFilter } from "../../../composables/useFilter.js";
import { useRemember, useRememberStringArray } from "../../../composables/useRemember.js";

interface MapTreeItem extends TreeItem {
    // Relative to map source dir
    vmfPath: string;
}

function isMapTreeItem(item: TreeItem): item is MapTreeItem {
    return (item as any).vmfPath !== undefined;
}

function handleRemoveMap(mapPath: string) {
    const idx = mapPaths.value.indexOf(mapPath);
    if (idx < 0) return;

    mapPaths.value.splice(idx, 1);
}

const searchTerm = ref("");

const { onBeforeMount: mountMapPath, ref: mapPaths } = useRememberStringArray(ref([]), "map-list");
const { onBeforeMount: mountMapDrawerOpen, ref: mapDrawerOpen } = useRemember(ref(false), "map-drawer-open");
const { onBeforeMount: mountConsoleDrawerOpen, ref: consoleDrawerOpen } = useRemember(ref(false), "map-console-open");

const drawerTree = ref<any[]>([]);

const compileState = ref<PlayPauseStopControlsState>(PlayPauseStopControlsState.Stopped);

async function loadDrawerTree() {
    const mapDirs = await window.electronAPI.map.listSourceDirs();
    drawerTree.value = mapDirs.map<TreeItem>((d) => ({
        label: d.dirName,
        children: d.vmfNames.map<MapTreeItem>((m) => ({
            label: filename(m),
            vmfPath: pathe.join(d.dirName, m),
        })),
    }));
}
loadDrawerTree();

const filteredMapPaths = useFilter<string>(mapPaths, (item) => item.toLowerCase(), searchTerm);

function isMapAdded(mapName: string) {
    return mapPaths.value.includes(mapName);
}

function addMap(mapName: string) {
    if (isMapAdded(mapName)) return;

    mapPaths.value.push(mapName);
}

onBeforeMount(() => {
    mountMapPath();
    mountMapDrawerOpen();
    mountConsoleDrawerOpen();

    window.electronAPI.map.subscribeQueueUpdated((arg) => {
        console.log(arg);
    });
});
</script>

<style scoped></style>
