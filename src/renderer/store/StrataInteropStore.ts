import { defineStore } from "pinia";

export const useStrataInteropStore = defineStore("strata-interop", () => {
    const connected = ref(false);

    window.electronAPI.interop.subscribeConnected(() => (connected.value = true));
    window.electronAPI.interop.subscribeDisconnected(() => (connected.value = false));

    return { connected };
});
