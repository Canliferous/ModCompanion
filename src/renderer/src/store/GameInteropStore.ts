import { defineStore } from "pinia";

export const useGameInteropStore = defineStore("game-interop", () => {
    const connected = ref(false);
    const log = ref("");
    const commandHistory = ref<string[]>([]);

    window.electronAPI.interop.subscribeConnected(() => (connected.value = true));
    window.electronAPI.interop.subscribeDisconnected(() => (connected.value = false));
    window.electronAPI.interop.subscribeLog((message: string) => (log.value += message));

    function addToHistory(command: string) {
        commandHistory.value = [...commandHistory.value, command];
    }

    function getHistoryUp(currentPrompt: string) {
        const pos = commandHistory.value.lastIndexOf(currentPrompt);

        if (pos >= 0) {
            return commandHistory.value[Math.max(pos - 1, 0)];
        }

        return undefined;
    }

    function getHistoryDown(currentPrompt: string) {
        const pos = commandHistory.value.lastIndexOf(currentPrompt);

        if (pos < commandHistory.value.length - 1) {
            return commandHistory.value[pos + 1];
        }

        return undefined;
    }

    function clearLog() {
        log.value = "";
    }

    return { connected, log, clearLog, addToHistory, getHistoryUp, getHistoryDown };
});
