import { ipcMain, IpcMainInvokeEvent } from "electron";
import { IpcChannels } from "./IpcChannels.js";
import { getMainWindow } from "../systems/window-system.js";

export function registerMapCompileApi(): boolean {
    ipcMain.handle(IpcChannels.MapQueueAdd, addToMapQueue);
    return true;
}

const mapCompileQueue: string[] = [];

function addToMapQueue(event: IpcMainInvokeEvent, mapPath: string) {
    if (mapCompileQueue.includes(mapPath)) {
        console.warn(`Map ${mapPath} is already in queue`);
        return;
    }

    mapCompileQueue.push(mapPath);
    getMainWindow()?.webContents.send(IpcChannels.MapQueueAdd, mapCompileQueue);
}
