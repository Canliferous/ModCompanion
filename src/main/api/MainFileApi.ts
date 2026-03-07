import { ipcMain } from "electron";
import fs from "node:fs/promises";
import { Stream } from "node:stream";
import * as Shared from "mod_companion_shared";

export function registerFileApi(): boolean {
    ipcMain.handle(
        Shared.Ipc.Channels.FileReadString,
        async (event: Electron.IpcMainInvokeEvent, filePath: string): Promise<string> => {
            return fs.readFile(filePath, "utf-8");
        },
    );

    ipcMain.handle(
        Shared.Ipc.Channels.FileWriteString,
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
