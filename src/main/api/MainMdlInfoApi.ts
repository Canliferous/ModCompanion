import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";

export function registerMdlInfoApi() {
    ipcMain.handle(SharedIpcChannels.MdlInfoGet, (e, mdlFilePath: string) => {});
}
