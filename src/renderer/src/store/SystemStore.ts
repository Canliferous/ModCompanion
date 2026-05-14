import { defineStore } from "pinia";

export const useSystemStore = defineStore("system-store", () => {
    const version = ref("");

    window.electronAPI.app.getAppVersion().then((value) => {
        version.value = value;
    });

    return { version };
});
