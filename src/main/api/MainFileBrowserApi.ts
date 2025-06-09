import { ipcMain } from "electron";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";
import { browseToFile } from "../helpers/MainFileBrowseHelper.js";

export function registerFileBrowserApi(): boolean {
    ipcMain.on(SharedIpcChannels.AppBrowseToFile, (event, filePath: string) => {
        browseToFile(filePath);
    });

    return true;
}
