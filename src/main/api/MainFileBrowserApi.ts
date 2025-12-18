import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { browseToFile, openFile } from "../helpers/MainFileBrowseHelper.js";
import {
    SharedFileBrowserDirectoryUpdatedReport,
    SharedProjectFileEntry,
    SharedProjectListFilesReport,
} from "Shared/SharedFileListing.js";
import path from "path";
import { getAppConfig } from "../systems/MainConfigSystem.js";
import child_process from "node:child_process";
import { IpcHelper } from "./MainApiHelper.js";
import { FileBrowserSystem } from "../systems/MainFileBrowserSystem.js";

export function registerFileBrowserApi(): boolean {
    ipcMain.on(SharedIpcChannels.FileBrowserBrowseToFile, (event: Electron.IpcMainEvent, filePath: string): void => {
        browseToFile(filePath);
    });

    ipcMain.on(SharedIpcChannels.FileBrowserOpenFile, (event: Electron.IpcMainEvent, filePath: string): void => {
        openFile(filePath);
    });

    ipcMain.handle(
        SharedIpcChannels.FileBrowserListFiles,
        async (event: Electron.IpcMainInvokeEvent, dirPath: string): Promise<SharedProjectListFilesReport> => {
            const config = getAppConfig();
            const fullPath = path.join(config.rootPath, dirPath);
            const results = await FileBrowserSystem.listFiles(fullPath, dirPath);
            return results;
        },
    );

    ipcMain.handle(
        SharedIpcChannels.FileBrowserCorrectPath,
        async (event: Electron.IpcMainInvokeEvent, somePath: string): Promise<string | undefined> => {
            return FileBrowserSystem.correctProjectPath(somePath);
        },
    );

    ipcMain.on(
        SharedIpcChannels.FileBrowserLaunchFile,
        (event: Electron.IpcMainEvent, filePath: string | string[]): void => {
            const files = Array.isArray(filePath) ? filePath : [filePath];
            for (const file of files) {
                let p = "";
                if (path.isAbsolute(file)) {
                    p = file;
                } else {
                    const config = getAppConfig();
                    p = path.join(config.rootPath, file);
                }

                console.log("Launching project file", p);

                try {
                    child_process.execFile(p, { shell: true }, (error, stdout, stderr) => {
                        if (error) {
                            console.warn(error);
                        }
                        if (stdout) {
                            console.debug(stdout);
                        }
                        if (stderr) {
                            console.warn(stderr);
                        }
                    });
                } catch (e) {
                    console.warn(e);
                }
            }
        },
    );

    ipcMain.on(SharedIpcChannels.FileBrowserSetCurrentPath, (event: Electron.IpcMainEvent, dirPath: string): void => {
        FileBrowserSystem.setCurrentDir(dirPath);
    });

    return true;
}

export function notifyFileBrowserDirectoryUpdated(report: SharedFileBrowserDirectoryUpdatedReport) {
    IpcHelper.send(SharedIpcChannels.FileBrowserCurrentDirUpdated, report);
}
