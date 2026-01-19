import { defineStore } from "pinia";
import { SharedMapPresets } from "Shared/SharedMapPreset.js";
import { configInitializedEvent } from "~/renderer-config.js";

export const useMapPresetsStore = defineStore("map-presets", () => {
    const presets = ref<SharedMapPresets>({});

    configInitializedEvent.on((payload) => {
        if (payload.mapPresets) {
            presets.value = payload.mapPresets;
        }
    });

    return { presets };
});
