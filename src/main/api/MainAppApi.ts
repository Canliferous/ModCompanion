import { app, ipcMain } from "electron";
import { WindowSystem } from "../systems/MainWindowSystem.js";
import * as Shared from "mod_companion_shared";
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

        ipcMain.on(Shared.Ipc.Channels.AppRendererReady, () => {
            IpcHelper.markRendererReady();
        });

        return true;
    },
};
