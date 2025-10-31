import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedMapCompileLogEvent } from "Shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileProgressEvent } from "Shared/SharedMapCompileProgressEvent.js";
import { IpcHelper } from "./MainApiHelper.js";
import { MapCompileSystem } from "../systems/MainMapCompileSystem.js";

export function registerMapCompileApi(): boolean {
    ipcMain.on(SharedIpcChannels.MapEnqueue, (event, mapPath: string) => {
        return MapCompileSystem.enqueue(mapPath);
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
