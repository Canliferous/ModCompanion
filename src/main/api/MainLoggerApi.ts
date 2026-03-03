import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedLogEvent } from "Shared/SharedLogger.js";
import { Logger } from "Core/systems/CoreLogSystem.js";
import { IpcHelper } from "./MainApiHelper.js";

export function registerLoggerApi(): boolean {
    ipcMain.on(SharedIpcChannels.LogSendFromRenderer, (event, logEvent: SharedLogEvent) => {
        Logger.processLog(logEvent, false);
    });

    return true;
}

export function notifyLogFromMain(logEvent: SharedLogEvent): void {
    IpcHelper.send(SharedIpcChannels.LogSendFromMain, logEvent);
}
