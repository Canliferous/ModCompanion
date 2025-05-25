import { AppConfig } from "../shared/AppConfig.js";

let config: AppConfig;

export function getAppConfig(): AppConfig {
    return config;
}

export function initConfig() {
    window.electronAPI.config.get().then((cfg) => {
        console.log("Config loaded from main");
        config = cfg;
    });
}
