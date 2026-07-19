import { ipcMain } from "electron";
import * as pathe from "pathe";
import { IpcHelper } from "./MainApiHelper.js";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";
import { FileEntry } from "mod_companion_shared/SharedFileBrowser.js";

export const FileBrowserApi = {
    register(): boolean {
        ipcMain.on(
            Shared.Ipc.Channels.FileBrowser_BrowseToFileAction,
            (event: Electron.IpcMainEvent, filePath: string, base?: Shared.FileBrowser.PathBase): void => {
                Core.FileBrowseHelper.browseToFile(filePath, base);
            },
        );

        ipcMain.handle(
            Shared.Ipc.Channels.FileBrowser_FileEntryQuery,
            (
                event: Electron.IpcMainInvokeEvent,
                filePath: string,
                base?: Shared.FileBrowser.PathBase,
            ): Promise<FileEntry | undefined> => {
                return Core.FileBrowseHelper.getFileEntry(filePath, base);
            },
        );

        ipcMain.on(
            Shared.Ipc.Channels.FileBrowser_OpenAction,
            (event: Electron.IpcMainEvent, filePath: string | string[], base?: Shared.FileBrowser.PathBase): void => {
                if (Array.isArray(filePath)) {
                    for (const p of filePath) {
                        Core.FileBrowseHelper.openFile(p, base);
                    }
                } else {
                    Core.FileBrowseHelper.openFile(filePath, base);
                }
            },
        );

        ipcMain.handle(
            Shared.Ipc.Channels.FileBrowser_ListFilesQuery,
            async (event: Electron.IpcMainInvokeEvent, dirPath: string): Promise<Shared.FileBrowser.FileEntries> => {
                const config = Core.ConfigSystem.getAppConfig();
                const fullPath = pathe.join(config.rootPath, dirPath);
                const results = await Core.FileBrowserSystem.listFiles(fullPath, dirPath);
                return results;
            },
        );

        ipcMain.handle(
            Shared.Ipc.Channels.FileBrowser_CorrectPathQuery,
            async (event: Electron.IpcMainInvokeEvent, somePath: string): Promise<string | undefined> => {
                return Core.FileBrowserSystem.correctProjectPath(somePath);
            },
        );

        ipcMain.on(
            Shared.Ipc.Channels.FileBrowser_ExecuteAction,
            (event: Electron.IpcMainEvent, filePath: string | string[], base?: Shared.FileBrowser.PathBase): void => {
                if (Array.isArray(filePath)) {
                    for (const file of filePath) {
                        Core.FileBrowseHelper.executeFile(file, base);
                    }
                } else {
                    Core.FileBrowseHelper.executeFile(filePath, base);
                }
            },
        );

        ipcMain.on(
            Shared.Ipc.Channels.FileBrowser_UpdateOpenedDirsAction,
            (event: Electron.IpcMainEvent, dirs: string[]): void => {
                Core.FileBrowserSystem.updateOpenedDirs(dirs);
            },
        );

        return true;
    },

    notifyDirUpdated(dir: string, entries: Shared.FileBrowser.FileEntries): void {
        IpcHelper.send(Shared.Ipc.Channels.FileBrowser_DirUpdatedEvent, dir, entries);
    },
    notifyIndexUpdated(index: Map<string, Shared.FileBrowser.FileEntry[]>): void {
        IpcHelper.send(Shared.Ipc.Channels.FileBrowser_IndexUpdatedEvent, index);
    },
};
