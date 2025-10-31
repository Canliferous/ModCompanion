import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { enqueueMap, getMapQueue } from "../systems/MainMapCompileSystem.js";
import { SharedMapCompileLogEvent } from "Shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "Shared/SharedMapCompileProgressEvent.js";
import { IpcHelper } from "./MainApiHelper.js";

export function registerMapCompileApi(): boolean {
    ipcMain.on(SharedIpcChannels.MapEnqueue, (event, mapPath: string) => enqueueMap(mapPath));
    return true;
}

export function notifyQueueUpdated(): void {
    IpcHelper.send(SharedIpcChannels.MapQueueUpdated, getMapQueue());
}

export function notifyCompileLog(event: SharedMapCompileLogEvent): void {
    IpcHelper.send(SharedIpcChannels.MapCompileLog, event);
}

export function notifyCompileProgress(event: SharedMapCompileProgressEvent): void {
    IpcHelper.send(SharedIpcChannels.MapCompileProgress, event);
}
