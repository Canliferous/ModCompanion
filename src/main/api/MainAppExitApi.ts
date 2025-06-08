import { ipcMain, app } from "electron";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";

export function registerAppExitApi(): boolean {
    ipcMain.on(SharedIpcChannels.AppExit, (event) => {
        app.exit();
    });

    return true;
}
