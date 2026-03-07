import { ipcMain } from "electron";
import { IpcHelper } from "./MainApiHelper.js";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerMapCompileApi(): boolean {
    ipcMain.on(Shared.Ipc.Channels.MapQueueEnqueue, (event, mapPaths: string[]) => {
        Core.MapCompileSystem.enqueue(mapPaths);
    });
    ipcMain.on(Shared.Ipc.Channels.MapQueueSetPaused, (event, paused: boolean) => {
        Core.MapCompileSystem.setPaused(paused);
    });
    ipcMain.on(Shared.Ipc.Channels.MapQueueCancel, () => {
        Core.MapCompileSystem.cancelQueue();
    });
    return true;
}

export function notifyQueueUpdated(): void {
    IpcHelper.send(Shared.Ipc.Channels.MapQueueUpdated, Core.MapCompileSystem.getQueue());
}

export function notifyCompileLog(event: Shared.Map.SharedMapCompileLogEvent): void {
    IpcHelper.send(Shared.Ipc.Channels.MapCompileLog, event);
}

export function notifyCompileProgress(event: Shared.Map.SharedMapCompileProgressEvent): void {
    IpcHelper.send(Shared.Ipc.Channels.MapCompileProgress, event);
}
