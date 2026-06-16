import { ipcMain } from "electron";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
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
            Core.Logger.info(Shared.Log.Channel.FileBrowser, "Writing to ", fullPath);
            return fs.writeFile(fullPath, data);
        },
    );

    ipcMain.handle(
        Shared.Ipc.Channels.FileDelete,
        async (
            event: Electron.IpcMainInvokeEvent,
            filePath: string,
            base?: Shared.FileBrowser.PathBase,
        ): Promise<boolean> => {
            const fullPath = Shared.FileBrowser.makeAbsolute(filePath, base, Core.ConfigSystem.getAppConfig());
            try {
                Core.Logger.info(Shared.Log.Channel.FileBrowser, "Deleting", fullPath);
                await fs.rm(fullPath);
                return true;
            } catch (e) {
                Core.Logger.warning(Shared.Log.Channel.FileBrowser, "Failed to delete", fullPath);
                return false;
            }
        },
    );

    ipcMain.handle(
        Shared.Ipc.Channels.FileExists,
        (event: Electron.IpcMainInvokeEvent, filePath: string, base?: Shared.FileBrowser.PathBase): boolean => {
            const fullPath = Shared.FileBrowser.makeAbsolute(filePath, base, Core.ConfigSystem.getAppConfig());
            return existsSync(fullPath);
        },
    );

    return true;
}
