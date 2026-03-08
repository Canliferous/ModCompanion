import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { useRememberRef } from "~/composables/useRemember.js";
import * as Shared from "mod_companion_shared";

export const useMapConsoleStore = defineStore("map-console", () => {
    const isOpen = useRememberRef(ref(false), "map-console-open");
    const logMap = reactive<Map<string, string>>(new Map<string, string>());
    const mapsWithLog = reactive(new Set<string>());
    const currentStep = ref<Shared.Map.SharedMapCompileStep>(Shared.Map.SharedMapCompileStep.VBsp);

    function toggleOpen() {
        isOpen.value = !isOpen.value;
    }

    window.electronAPI.map.subscribeCompileProgress((event) => {
        if (event.state === Shared.Map.CompileState.InProgress) {
            currentStep.value = event.step;
        }
    });

    window.electronAPI.map.subscribeCompileLog((event: Shared.Map.SharedMapCompileLogEvent) => {
        const key = event.mapPath + event.step;

        const existingText = logMap.get(key) ?? "";
        logMap.set(key, existingText + event.message);
        mapsWithLog.add(event.mapPath);
    });

    function getLog(map: string, step: Shared.Map.SharedMapCompileStep) {
        return logMap.get(map + String(step)) ?? "";
    }

    return { isOpen, toggleOpen, logMap, currentStep, getLog, mapsWithLog };
});
