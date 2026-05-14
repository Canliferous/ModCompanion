import { ipcMain, shell } from "electron";
import { WindowSystem } from "../systems/MainWindowSystem.js";
import * as Shared from "mod_companion_shared";
import * as Core from "mod_companion_core";
import { IpcHelper } from "./MainApiHelper.js";

export const AppApi = {
    register(): boolean {
        ipcMain.on(Shared.Ipc.Channels.AppExitForReal, () => {
            WindowSystem.exitForReal();
        });

        ipcMain.on(Shared.Ipc.Channels.AppCloseWindow, () => {
            WindowSystem.closeWindow();
        });

        ipcMain.on(Shared.Ipc.Channels.AppMinimize, () => {
            WindowSystem.minimize();
        });

        ipcMain.on(Shared.Ipc.Channels.AppMaximize, () => {
            WindowSystem.maximize();
        });

        ipcMain.on(Shared.Ipc.Channels.AppOpenExternal, (e, payload: string) => {
            shell.openExternal(payload);
        });

        ipcMain.handle(Shared.Ipc.Channels.AppVersion, () => {
            return Core.AppVersionHelper.getAppVersion();
        });

        ipcMain.on(Shared.Ipc.Channels.AppRendererReady, () => {
            IpcHelper.markRendererReady();
        });

        return true;
    },
};
