import { ipcMain, app } from "electron";
import { IpcChannels } from "./IpcChannels.js";

export function registerExitAppApi(): boolean {
    ipcMain.on(IpcChannels.ExitApp, (event) => {
        app.exit();
    });

    return true;
}
