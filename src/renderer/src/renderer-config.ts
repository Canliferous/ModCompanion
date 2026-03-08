import { useEvent } from "~/composables/useEvent.js";
import * as Shared from "mod_companion_shared";

let config: Shared.AppConfig.IAppConfig;

export function getAppConfig(): Shared.AppConfig.IAppConfig {
    return config;
}

export const configInitializedEvent = useEvent<Shared.AppConfig.IAppConfig>();

export function initConfig() {
    window.electronAPI.config.get().then((cfg: Shared.AppConfig.IAppConfig) => {
        console.log("Config loaded from main");
        config = cfg;
        configInitializedEvent.call(cfg);
    });
}
