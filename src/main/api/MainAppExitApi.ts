import { ipcMain, app } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { disablePreventClose } from "../systems/MainWindowSystem.js";

export function registerAppExitApi(): boolean {
    ipcMain.on(SharedIpcChannels.AppExit, (event) => {
        disablePreventClose();
        app.quit();
    });

    return true;
}
