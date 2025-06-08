import { defineStore } from "pinia";
import { useRemember } from "../composables/useRemember.js";
import { reactive, ref } from "vue";
import {
    isAppendErrorEvent,
    isAppendMessageEvent,
    isClearEvent,
    SharedMapCompileLogEvent,
} from "../../shared/SharedMapCompileLogEvent.js";

export const useMapConsoleStore = defineStore("map-console", () => {
    const isOpen = useRemember(ref(false), "map-console-open");
    const logMessageTextMap = reactive<Map<string, string>>(new Map<string, string>());
    const logErrorTextMap = reactive<Map<string, string>>(new Map<string, string>());

    function toggleOpen() {
        isOpen.value = !isOpen.value;
    }

    window.electronAPI.map.subscribeCompileLog((event: SharedMapCompileLogEvent) => {
        if (isClearEvent(event)) {
            logMessageTextMap.set(event.mapPath, "");
        } else if (isAppendMessageEvent(event)) {
            const t = logMessageTextMap.get(event.mapPath) ?? "";
            logMessageTextMap.set(event.mapPath, t + event.message);
        } else if (isAppendErrorEvent(event)) {
            const t = logMessageTextMap.get(event.mapPath) ?? "";
            logErrorTextMap.set(event.mapPath, t + event.message);
        }
    });

    return { isOpen, toggleOpen, logMessageTextMap, logErrorTextMap };
});
