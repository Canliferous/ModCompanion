import { app, ipcMain } from "electron";
import { WindowSystem } from "../systems/MainWindowSystem.js";
import * as Shared from "mod_companion_shared";

export function registerAppExitApi(): boolean {
    ipcMain.on(Shared.Ipc.Channels.AppExit, () => {
        WindowSystem.disablePreventClose();
        app.quit();
    });

    return true;
}
