import { ipcMain } from "electron";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";
import { browseToFile, openFile } from "../helpers/MainFileBrowseHelper.js";

export function registerFileBrowserApi(): boolean {
    ipcMain.on(SharedIpcChannels.AppBrowseToFile, (event, filePath: string) => {
        browseToFile(filePath);
    });

    ipcMain.on(SharedIpcChannels.AppOpenFile, (event, filePath: string) => {
        openFile(filePath);
    });

    return true;
}
