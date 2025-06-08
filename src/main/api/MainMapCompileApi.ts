import { ipcMain, IpcMainInvokeEvent } from "electron";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";
import { getMainWindow } from "../systems/MainWindowSystem.js";
import { enqueueMap, getMapQueue } from "../systems/MainMapCompileSystem.js";
import { SharedMapCompileLogEvent } from "../../shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "../../shared/SharedMapCompileProgressEvent.js";

export function registerMapCompileApi(): boolean {
    ipcMain.on(SharedIpcChannels.MapEnqueue, (event, mapPath: string) => enqueueMap(mapPath));
    return true;
}

export function notifyQueueUpdated(): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.MapQueueUpdated, getMapQueue());
}

export function notifyCompileLog(event: SharedMapCompileLogEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.MapCompileLog, event);
}

export function notifyCompileProgress(event: SharedMapCompileProgressEvent): void {
    getMainWindow()?.webContents.send(SharedIpcChannels.MapCompileProgress, event);
}
