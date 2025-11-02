import { ref } from "vue";
import { defineStore } from "pinia";
import { useRememberStringArray, useRememberWorkspaceRef } from "~/composables/useRemember.js";
import { useFilter } from "~/composables/useFilter.js";

export const useMapListStore = defineStore("map-list", () => {
    const mapList = useRememberStringArray(ref<string[]>([]), "map-list");
    const searchTerm = useRememberWorkspaceRef(ref<string>(""), "map-search");
    const filteredMapList = useFilter<string>(mapList, (item) => item.toLowerCase(), searchTerm);
    const selectedMap = ref<string | undefined>();
    const mapQueue = ref<string[]>([]);

    function selectMap(mapPath: string | undefined) {
        selectedMap.value = mapPath;
    }

    function isMapInList(mapName: string): boolean {
        return mapList.value.includes(mapName);
    }

    function addMap(mapName: string): void {
        if (isMapInList(mapName)) return;

        mapList.value.push(mapName);
    }

    function removeMap(mapPath: string): void {
        const idx = mapList.value.indexOf(mapPath);
        if (idx < 0) return;

        mapList.value.splice(idx, 1);
    }

    window.electronAPI.map.subscribeQueueUpdated((arg) => {
        mapQueue.value = arg;
    });

    return {
        mapList,
        filteredMapList,
        searchTerm,
        selectedMap,
        mapQueue,
        addMap,
        removeMap,
        isMapInList,
        selectMap,
    };
});
