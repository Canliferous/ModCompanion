import { ipcMain } from "electron";
import { IpcChannels } from "../../shared/IpcChannels.js";
import { getConfig } from "../systems/MainConfigSystem.js";

export function registerAppConfigApi(): boolean {
    ipcMain.handle(IpcChannels.ConfigGet, (event) => {
        return getConfig();
    });
    return true;
}
