import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { setHotReloadEnabled } from "../systems/MainHotReloadSystem.js";

export function registerHotReloadApi(): boolean {
    ipcMain.on(SharedIpcChannels.HotReloadSetEnabled, (event, enable: boolean) => {
        setHotReloadEnabled(enable);
    });

    return true;
}
