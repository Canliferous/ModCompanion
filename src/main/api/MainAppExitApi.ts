import { ipcMain, app } from "electron";
import { IpcChannels } from "../../shared/IpcChannels.js";

export function registerAppExitApi(): boolean {
    ipcMain.on(IpcChannels.AppExit, (event) => {
        app.exit();
    });

    return true;
}
