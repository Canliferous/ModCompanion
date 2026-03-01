import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import fs from "node:fs/promises";
import { Stream } from "node:stream";

export function registerFileApi(): boolean {
    ipcMain.handle(
        SharedIpcChannels.FileReadString,
        async (event: Electron.IpcMainInvokeEvent, filePath: string): Promise<string> => {
            return fs.readFile(filePath, "utf-8");
        },
    );

    ipcMain.handle(
        SharedIpcChannels.FileWriteString,
        async (
            event: Electron.IpcMainInvokeEvent,
            filePath: string,
            data:
                | string
                | NodeJS.ArrayBufferView
                | Iterable<string | NodeJS.ArrayBufferView>
                | AsyncIterable<string | NodeJS.ArrayBufferView>
                | Stream,
        ): Promise<void> => {
            return fs.writeFile(filePath, data);
        },
    );

    return true;
}
