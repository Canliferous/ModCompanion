import { ipcMain } from "electron";
import { IpcChannels } from "./IpcChannels.js";

export function registerLauncherApi(): boolean {
    ipcMain.on(IpcChannels.Launch, (event) => {
        console.log("launch hello main");
    });

    return true;
}
