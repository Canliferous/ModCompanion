import { defineStore } from "pinia";
import { configInitializedEvent, getAppConfig } from "~/renderer-config.js";
import { debounce } from "lodash";
import * as Shared from "mod_companion_shared";

export const useChamberSignConfigStore = defineStore("chamber-sign-config", () => {
    const config = reactive<Shared.ChamberSignConfig.SharedChamberSignConfig>({ maps: [] });
    const suppressWatch = ref(false);

    configInitializedEvent.on((payload) => {
        refresh();
    });
    async function refresh(): Promise<void> {
        const newConfig = JSON.parse(
            await window.electronAPI.file.readString(getAppConfig().chamberSignConfigJson),
        ) as Shared.ChamberSignConfig.SharedChamberSignConfig;

        suppressWatch.value = true;
        config.maps = newConfig.maps;
        suppressWatch.value = false;
    }

    const save = debounce(async (c: Shared.ChamberSignConfig.SharedChamberSignConfig) => {
        const data = JSON.stringify(toRaw(c), undefined, 4);
        await window.electronAPI.file.writeString(getAppConfig().chamberSignConfigJson, data);
        window.electronAPI.hotReload.reloadChamberSignConfig();
    }, 300);

    watch(config, (value, oldValue) => {
        if (!suppressWatch.value) {
            save(value);
        }
    });

    return { config, refresh };
});
