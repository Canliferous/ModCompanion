import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedFsEntry } from "Shared/SharedFileListing.js";
import fs from "fs/promises";
import { getConfig } from "../systems/MainConfigSystem.js";
import path from "path";
import * as child_process from "node:child_process";

export function registerProjectFilesApi(): boolean {
    ipcMain.handle(SharedIpcChannels.ProjectListFiles, async (event, dirPath: string): Promise<SharedFsEntry[]> => {
        return _listFiles(dirPath);
    });

    ipcMain.handle(
        SharedIpcChannels.ProjectCorrectPath,
        async (event, somePath: string): Promise<string | undefined> => {
            return _correctProjectPath(somePath);
        },
    );

    ipcMain.on(SharedIpcChannels.ProjectLaunchFile, (event, filePath: string) => {
        let p = "";
        if (path.isAbsolute(filePath)) {
            p = filePath;
        } else {
            const config = getConfig();
            p = path.join(config.rootPath, filePath);
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
    });

    return true;
}

function _isProjectPath(p: string): boolean {
    const config = getConfig();
    return path.resolve(p).startsWith(config.rootPath);
}

function _correctProjectPath(somePath: string) {
    const config = getConfig();
    if (!path.isAbsolute(somePath)) {
        return somePath;
    }
    const ind = somePath.indexOf(config.rootPath);
    if (ind !== 0) return undefined;

    return somePath.replace(config.rootPath, "");
}

async function _listFiles(dirPath: string): Promise<SharedFsEntry[]> {
    const config = getConfig();
    const fullPath = path.join(config.rootPath, dirPath);

    if (!_isProjectPath(fullPath)) return [];

    const paths = await fs.readdir(fullPath);
    const infos: SharedFsEntry[] = [];

    for (const p of paths) {
        if (p.startsWith(".")) continue;

        const s = await fs.stat(path.join(fullPath, p));

        if (s.isFile()) {
            infos.push({
                name: p,
                path: path.join(dirPath, p).replaceAll("\\", "/"),
                isFile: true,
                fileSize: s.size,
            });
        } else {
            infos.push({
                name: p,
                path: path.join(dirPath, p).replaceAll("\\", "/"),
                isFile: false,
            });
        }
    }

    infos.sort((x, y) => (x.isFile === y.isFile ? 0 : x.isFile ? 1 : -1));
    // infos.sort((x, y) => (x.isFile === y.isFile ? 0 : x.isFile ? -1 : 1));

    return infos;
}
