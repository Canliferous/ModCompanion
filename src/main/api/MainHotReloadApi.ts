import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { HotReloadSystem } from "Core/systems/CoreHotReloadSystem.js";

export function registerHotReloadApi(): boolean {
    ipcMain.on(SharedIpcChannels.HotReloadSetEnabled, (event, enable: boolean) => {
        HotReloadSystem.setEnabled(enable);
    });

    ipcMain.on(SharedIpcChannels.HotReloadChamberSignConfig, (event) => {
        HotReloadSystem.reloadChamberSignConfig();
    });

    return true;
}
