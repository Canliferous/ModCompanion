import { defineStore } from "pinia";
import { SharedChamberSignConfig } from "Shared/SharedChamberSignConfig.js";
import { configInitializedEvent, getAppConfig } from "~/renderer-config.js";
import { debounce } from "lodash";

export const useChamberSignConfigStore = defineStore("chamber-sign-config", () => {
    const config = reactive<SharedChamberSignConfig>({ maps: [] });
    const suppressWatch = ref(false);

    configInitializedEvent.on((payload) => {
        refresh();
    });
    async function refresh(): Promise<void> {
        const newConfig = JSON.parse(
            await window.electronAPI.file.readString(getAppConfig().chamberSignConfigJson),
        ) as SharedChamberSignConfig;

        suppressWatch.value = true;
        config.maps = newConfig.maps;
        suppressWatch.value = false;
    }

    const save = debounce(async (c: SharedChamberSignConfig) => {
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
