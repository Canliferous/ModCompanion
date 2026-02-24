import { defineStore } from "pinia";
import { SharedTcArtifactsListAllMapsReportMap } from "Shared/SharedTcArtifacts.js";

export const useTcArtifactsStore = defineStore("tc-artifacts", () => {
    const connected = ref(false);
    const mapsList = ref<Map<string, SharedTcArtifactsListAllMapsReportMap[]>>(new Map());

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
        console.log(result);
        if (result?.maps) {
            mapsList.value = result?.maps;
        }
    }
    //
    // function getArtifacts(): Promise<> {}

    async function downloadMap(mapPath: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    return { connected, downloadMap, refresh, mapsList };
});
