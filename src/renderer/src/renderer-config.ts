import { useEvent } from "~/composables/useEvent.js";
import * as Shared from "mod_companion_shared";
import { Logger } from "~/logger.js";

let config: Shared.AppConfig.AppConfig;

export function getAppConfig(): Shared.AppConfig.AppConfig {
    return config;
}

export const configInitializedEvent = useEvent<Shared.AppConfig.AppConfig>();

export function initConfig() {
    window.electronAPI.config.get().then((cfg: Shared.AppConfig.AppConfig) => {
        Logger.info(Shared.Log.Channel.Generic, "Config loaded from main");
        config = cfg;
        configInitializedEvent.call(cfg);
    });
}
