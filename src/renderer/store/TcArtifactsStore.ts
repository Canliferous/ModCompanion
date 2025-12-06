import { defineStore } from "pinia";

export const useTcArtifactsStore = defineStore("tc-artifacts", () => {
    const connected = ref(false);

    async function checkAlive() {
        connected.value = await window.electronAPI.tcArtifacts.isConnected();

        if (connected.value) {
            setTimeout(checkAlive, 15000);
        } else {
            setTimeout(checkAlive, 1000);
        }
    }
    checkAlive();

    return { connected };
});
