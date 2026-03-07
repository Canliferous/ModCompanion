import { ipcMain } from "electron";
import { IpcHelper } from "./MainApiHelper.js";
import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerLoggerApi(): boolean {
    ipcMain.on(Shared.Ipc.Channels.LogSendFromRenderer, (event, logEvent: Shared.Log.Event) => {
        Core.Logger.processLog(logEvent, false);
    });

    return true;
}

export function notifyLogFromMain(logEvent: Shared.Log.Event): void {
    IpcHelper.send(Shared.Ipc.Channels.LogSendFromMain, logEvent);
}
