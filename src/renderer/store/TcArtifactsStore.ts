import { defineStore } from "pinia";
import { SharedTcArtifactsListAllMapsReportMap } from "Shared/SharedTcArtifacts.js";
import { useMapListStore } from "~/store/MapListStore.js";
import { filename } from "pathe/utils";

export const useTcArtifactsStore = defineStore("tc-artifacts", () => {
    const connected = ref(false);
    const mapsList = ref<Map<string, SharedTcArtifactsListAllMapsReportMap[]>>(new Map());
    const activeDownloads = reactive<Map<string, Promise<boolean>>>(new Map());

    async function checkAlive() {
        connected.value = await window.electronAPI.tcArtifacts.isConnected();

        if (connected.value) {
            setTimeout(checkAlive, 15000);
        } else {
            setTimeout(checkAlive, 1000);
        }
    }
    checkAlive();

    async function refresh(): Promise<void> {
        const result = await window.electronAPI.tcArtifacts.listAllMaps();
        if (result?.maps) {
            mapsList.value = result?.maps;
        }
    }

    async function downloadMap(mapPath: string, objectKey: string): Promise<boolean> {
        const promise = window.electronAPI.tcArtifacts
            .downloadMap(objectKey, mapPath)
            .finally(() => activeDownloads.delete(mapPath));
        activeDownloads.set(mapPath, promise);
        return promise;
    }

    function downloadAll(): void {
        for (const map of useMapListStore().mapList) {
            const m = filename(map);
            if (!m) continue;
            const meta = mapsList.value.get(m);
            if (!meta || meta.length === 0) continue;

            downloadMap(map, meta[0].objectKey);
        }
    }

    return { connected, downloadMap, downloadAll, refresh, mapsList, activeDownloads };
});
