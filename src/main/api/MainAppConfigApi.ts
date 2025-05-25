import { ipcMain } from "electron";
import { IpcChannels } from "./IpcChannels.js";
import { getConfig } from "../systems/config-system.js";

export function registerAppConfigApi(): boolean {
    ipcMain.handle(IpcChannels.ConfigGet, (event) => {
        return getConfig();
    });
    return true;
}
