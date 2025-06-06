import { defineStore } from "pinia";
import { useRemember } from "../composables/useRemember.js";
import { ref } from "vue";

export const useMapConsoleStore = defineStore("map-console", () => {
    const isOpen = useRemember(ref(false), "map-console-open");
    const logText = ref<string>("");

    function toggleOpen() {
        isOpen.value = !isOpen.value;
    }

    window.electronAPI.map.subscribeCompileLog((log) => {
        logText.value += log;
    });

    return { isOpen, toggleOpen, logText };
});
