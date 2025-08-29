import { ref } from "vue";
import { defineStore } from "pinia";
import { useRememberStringArray, useRememberWorkspaceRef } from "~/composables/useRemember.js";
import { useFilter } from "~/composables/useFilter.js";

export const useMapListStore = defineStore("map-list", () => {
    const mapPaths = useRememberStringArray(ref<string[]>([]), "map-list");
    const searchTerm = useRememberWorkspaceRef(ref<string>(""), "map-search");
    const filteredMapPaths = useFilter<string>(mapPaths, (item) => item.toLowerCase(), searchTerm);
    const selectedMap = ref<string | undefined>();
    const mapQueue = ref<string[]>([]);

    function selectMap(mapPath: string | undefined) {
        selectedMap.value = mapPath;
    }

    function isMapAdded(mapName: string): boolean {
        return mapPaths.value.includes(mapName);
    }

    function addMap(mapName: string): void {
        if (isMapAdded(mapName)) return;

        mapPaths.value.push(mapName);
    }

    function removeMap(mapPath: string): void {
        const idx = mapPaths.value.indexOf(mapPath);
        if (idx < 0) return;

        mapPaths.value.splice(idx, 1);
    }

    window.electronAPI.map.subscribeQueueUpdated((arg) => {
        mapQueue.value = arg;
    });

    return { mapPaths, filteredMapPaths, addMap, removeMap, isMapAdded, searchTerm, selectedMap, selectMap, mapQueue };
});
