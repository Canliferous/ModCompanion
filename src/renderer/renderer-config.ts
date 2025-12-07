import { SharedAppConfig } from "Shared/SharedAppConfig.js";
import { useEvent } from "~/composables/useEvent.js";

let config: SharedAppConfig;

export function getAppConfig(): SharedAppConfig {
    return config;
}

export const configInitializedEvent = useEvent<SharedAppConfig>();

export function initConfig() {
    window.electronAPI.config.get().then((cfg: SharedAppConfig) => {
        console.log("Config loaded from main");
        config = cfg;
        configInitializedEvent.call(cfg);
    });
}
