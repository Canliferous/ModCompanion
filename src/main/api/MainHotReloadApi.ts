import { ipcMain } from "electron";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerHotReloadApi(): boolean {
    ipcMain.on(Shared.Ipc.Channels.HotReloadSetEnabled, (event, enable: boolean) => {
        Core.HotReloadSystem.setEnabled(enable);
    });

    ipcMain.on(Shared.Ipc.Channels.HotReloadChamberSignConfig, (event) => {
        Core.HotReloadSystem.reloadChamberSignConfig();
    });

    return true;
}
