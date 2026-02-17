import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { MdlInfoHelper } from "../helpers/MainMdlInfoHelper.js";

export function registerMdlInfoApi() {
    ipcMain.handle(SharedIpcChannels.MdlInfoGet, (e, mdlFilePath: string) => {
        return MdlInfoHelper.run(mdlFilePath);
    });

    return true;
}
