import { ipcMain, IpcMainInvokeEvent } from "electron";
import { IpcChannels } from "../../shared/IpcChannels.js";
import { getMainWindow } from "../systems/MainWindowSystem.js";
import { enqueueMap, getMapQueue } from "../systems/MainMapCompileSystem.js";
import { MapCompileLogEvent } from "../../shared/MapCompileLogEvent.js";

export function registerMapCompileApi(): boolean {
    ipcMain.on(IpcChannels.MapEnqueue, (event, mapPath: string) => enqueueMap(mapPath));
    return true;
}

export function notifyQueueUpdated() {
    getMainWindow()?.webContents.send(IpcChannels.MapQueueUpdated, getMapQueue());
}

export function notifyCompileLog(event: MapCompileLogEvent) {
    getMainWindow()?.webContents.send(IpcChannels.MapCompileLog, event);
}
