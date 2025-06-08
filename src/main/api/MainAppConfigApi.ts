import { ipcMain } from "electron";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";
import { getConfig } from "../systems/MainConfigSystem.js";

export function registerAppConfigApi(): boolean {
    ipcMain.handle(SharedIpcChannels.ConfigGet, (event) => {
        return getConfig();
    });
    return true;
}
