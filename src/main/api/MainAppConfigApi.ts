import { ipcMain } from "electron";
import { Channels } from "../../shared/SharedIpcChannels.js";
import * as Core from "mod_companion_core";

export function registerAppConfigApi(): boolean {
    ipcMain.handle(Channels.ConfigGet, () => {
        return Core.ConfigSystem.getAppConfig();
    });
    return true;
}
