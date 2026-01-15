import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedMapPath } from "Shared/SharedMapPath.js";

export function registerMdlInfoApi() {
    ipcMain.handle(SharedIpcChannels.MdlInfoGet, (e, mdlFilePath: string) => {});
}
