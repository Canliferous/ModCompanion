import { ipcMain } from "electron";
import path from "path";
import child_process from "node:child_process";
import { IpcHelper } from "./MainApiHelper.js";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export const FileBrowserApi = {
    register(): boolean {
        ipcMain.on(
            Shared.Ipc.Channels.FileBrowser_BrowseToFileAction,
            (event: Electron.IpcMainEvent, filePath: string): void => {
                Core.FileBrowseHelper.browseToFile(filePath);
            },
        );

        ipcMain.on(
            Shared.Ipc.Channels.FileBrowser_OpenFileAction,
            (event: Electron.IpcMainEvent, filePath: string | string[]): void => {
                if (Array.isArray(filePath)) {
                    for (const p of filePath) {
                        Core.FileBrowseHelper.openFile(p);
                    }
                } else {
                    Core.FileBrowseHelper.openFile(filePath);
                }
            },
        );

        ipcMain.handle(
            Shared.Ipc.Channels.FileBrowser_ListFilesQuery,
            async (
                event: Electron.IpcMainInvokeEvent,
                dirPath: string,
            ): Promise<Shared.FileListing.SharedProjectListFilesReport> => {
                const config = Core.ConfigSystem.getAppConfig();
                const fullPath = path.join(config.rootPath, dirPath);
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
            Shared.Ipc.Channels.FileBrowser_LaunchFileAction,
            (event: Electron.IpcMainEvent, filePath: string | string[]): void => {
                const files = Array.isArray(filePath) ? filePath : [filePath];
                for (const file of files) {
                    let p = "";
                    if (path.isAbsolute(file)) {
                        p = file;
                    } else {
                        const config = Core.ConfigSystem.getAppConfig();
                        p = path.join(config.rootPath, file);
                    }

                    Core.Logger.info(Shared.Log.Channel.FileBrowser, "Launching file", p);

                    try {
                        child_process.execFile(p, { shell: true }, (error, stdout, stderr) => {
                            if (error) {
                                Core.Logger.warning(Shared.Log.Channel.FileBrowser, error);
                            }
                            if (stdout) {
                                Core.Logger.info(Shared.Log.Channel.FileBrowser, stdout);
                            }
                            if (stderr) {
                                Core.Logger.warning(Shared.Log.Channel.FileBrowser, stderr);
                            }
                        });
                    } catch (e) {
                        Core.Logger.warning(Shared.Log.Channel.FileBrowser, e);
                    }
                }
            },
        );

        ipcMain.on(
            Shared.Ipc.Channels.FileBrowser_SetCurrentPathAction,
            (event: Electron.IpcMainEvent, dirPath: string): void => {
                Core.FileBrowserSystem.setCurrentDir(dirPath);
            },
        );

        return true;
    },

    notifyDirUpdated(dir: string, entries: Shared.FileListing.FileEntry[]) {
        IpcHelper.send(Shared.Ipc.Channels.FileBrowser_DirUpdatedEvent, dir, entries);
    },
    notifyIndexUpdated(index: Map<string, Shared.FileListing.FileEntry[]>) {
        IpcHelper.send(Shared.Ipc.Channels.FileBrowser_IndexUpdatedEvent, index);
    },
};
