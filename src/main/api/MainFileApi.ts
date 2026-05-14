import { ipcMain } from "electron";
import fs from "node:fs/promises";
import { Stream } from "node:stream";
import * as Shared from "mod_companion_shared";
import * as Core from "mod_companion_core";

export function registerFileApi(): boolean {
    ipcMain.handle(
        Shared.Ipc.Channels.FileReadString,
        async (
            event: Electron.IpcMainInvokeEvent,
            filePath: string,
            base?: Shared.FileBrowser.PathBase,
        ): Promise<string | undefined> => {
            try {
                const fullPath = Shared.FileBrowser.makeAbsolute(filePath, base, Core.ConfigSystem.getAppConfig());
                return await fs.readFile(fullPath, "utf-8");
            } catch (e) {
                return undefined;
            }
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
            base?: Shared.FileBrowser.PathBase,
        ): Promise<void> => {
            const fullPath = Shared.FileBrowser.makeAbsolute(filePath, base, Core.ConfigSystem.getAppConfig());
            return fs.writeFile(fullPath, data);
        },
    );

    return true;
}
