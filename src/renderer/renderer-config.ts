import { SharedAppConfig } from "Shared/SharedAppConfig.js";

let config: SharedAppConfig;

export function getAppConfig(): SharedAppConfig {
    return config;
}

export function initConfig() {
    window.electronAPI.config.get().then((cfg: SharedAppConfig) => {
        console.log("Config loaded from main");
        config = cfg;
    });
}
