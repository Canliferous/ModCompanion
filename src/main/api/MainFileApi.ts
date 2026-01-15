import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import fs from "node:fs/promises";

export function registerFileApi(): boolean {
    ipcMain.handle(
        SharedIpcChannels.FileReadString,
        async (event: Electron.IpcMainInvokeEvent, filePath: string): Promise<string> => {
            return fs.readFile(filePath, "utf-8");
        },
    );

    return true;
}
