import { app, ipcMain } from "electron";
import { WindowSystem } from "../systems/MainWindowSystem.js";
import * as Shared from "mod_companion_shared";
import * as Core from "mod_companion_core";
import { FileBrowserApi } from "./MainFileBrowserApi.js";

export const AppApi = {
    register(): boolean {
        ipcMain.on(Shared.Ipc.Channels.AppExit, () => {
            WindowSystem.disablePreventClose();
            app.quit();
        });

        ipcMain.on(Shared.Ipc.Channels.AppRendererReady, () => {
            const index = Core.FileBrowserSystem.getPrefillIndex();
            FileBrowserApi.notifyIndexUpdated(index);
        });

        return true;
    },
};
