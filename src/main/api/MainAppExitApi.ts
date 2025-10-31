import { app, ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { WindowSystem } from "../systems/MainWindowSystem.js";

export function registerAppExitApi(): boolean {
    ipcMain.on(SharedIpcChannels.AppExit, () => {
        WindowSystem.disablePreventClose();
        app.quit();
    });

    return true;
}
