import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedMapCompileLogEvent } from "Shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "Shared/SharedMapCompileProgressEvent.js";
import { IpcHelper } from "./MainApiHelper.js";
import { MapCompileSystem } from "../systems/MainMapCompileSystem.js";

export function registerMapCompileApi(): boolean {
    ipcMain.on(SharedIpcChannels.MapQueueEnqueue, (event, mapPaths: string[]) => {
        MapCompileSystem.enqueue(mapPaths);
    });
    ipcMain.on(SharedIpcChannels.MapQueueSetPaused, (event, paused: boolean) => {
        MapCompileSystem.setPaused(paused);
    });
    ipcMain.on(SharedIpcChannels.MapQueueCancel, () => {
        MapCompileSystem.cancelQueue();
    });
    return true;
}

export function notifyQueueUpdated(): void {
    IpcHelper.send(SharedIpcChannels.MapQueueUpdated, MapCompileSystem.getQueue());
}

export function notifyCompileLog(event: SharedMapCompileLogEvent): void {
    IpcHelper.send(SharedIpcChannels.MapCompileLog, event);
}

export function notifyCompileProgress(event: SharedMapCompileProgressEvent): void {
    IpcHelper.send(SharedIpcChannels.MapCompileProgress, event);
}
