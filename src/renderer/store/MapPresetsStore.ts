import { defineStore } from "pinia";
import { configInitializedEvent } from "~/renderer-config.js";
import * as Shared from "mod_companion_shared";

export const useMapPresetsStore = defineStore("map-presets", () => {
    const presets = ref<Shared.Map.SharedMapPresets>({});

    configInitializedEvent.on((payload) => {
        if (payload.mapPresets) {
            presets.value = payload.mapPresets;
        }
    });

    return { presets };
});
