import { ipcMain } from "electron";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";
import { getAppConfig } from "../systems/MainConfigSystem.js";

export function registerAppConfigApi(): boolean {
    ipcMain.handle(SharedIpcChannels.ConfigGet, (event) => {
        return getAppConfig();
    });
    return true;
}
