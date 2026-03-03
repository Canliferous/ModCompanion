import { ipcMain } from "electron";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";
import { getAppConfig } from "Core/systems/CoreConfigSystem.js";

export function registerAppConfigApi(): boolean {
    ipcMain.handle(SharedIpcChannels.ConfigGet, () => {
        return getAppConfig();
    });
    return true;
}
