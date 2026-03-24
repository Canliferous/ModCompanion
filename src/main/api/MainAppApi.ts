import { app, ipcMain } from "electron";
import { WindowSystem } from "../systems/MainWindowSystem.js";
import * as Shared from "mod_companion_shared";
import { IpcHelper } from "./MainApiHelper.js";

export const AppApi = {
    register(): boolean {
        ipcMain.on(Shared.Ipc.Channels.AppExit, () => {
            WindowSystem.disablePreventClose();
            app.quit();
        });

        ipcMain.on(Shared.Ipc.Channels.AppRendererReady, () => {
            IpcHelper.markRendererReady();
        });

        return true;
    },
};
