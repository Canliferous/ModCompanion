import { defineStore } from "pinia";
import { useRememberStringArray } from "../composables/useRemember.js";
import { Ref, ref } from "vue";
import { useFilter } from "../composables/useFilter.js";

export const useMapListStore = defineStore("map-list", () => {
    const mapPaths = useRememberStringArray(ref([]), "map-list");
    const searchTerm = ref<string>("");
    const filteredMapPaths = useFilter<string>(mapPaths, (item) => item.toLowerCase(), searchTerm);
    const selectedMap = ref<string | undefined>();

    function selectMap(mapPath: string | undefined) {
        console.log(mapPath);
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

    return { mapPaths, filteredMapPaths, addMap, removeMap, isMapAdded, searchTerm, selectedMap, selectMap };
});
