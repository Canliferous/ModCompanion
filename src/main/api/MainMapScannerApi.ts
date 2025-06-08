import { ipcMain } from "electron";
import { SharedIpcChannels } from "../../shared/SharedIpcChannels.js";
import { getConfig } from "../systems/MainConfigSystem.js";
import fs from "fs/promises";
import path from "path";
import { SharedMapSourceDir } from "../../shared/SharedMapTypes.js";

export function registerMapScannerApi(): boolean {
    ipcMain.handle(SharedIpcChannels.MapListSourceDirs, listMapSourceDirs);
    return true;
}

export async function listMapSourceDirs(): Promise<SharedMapSourceDir[]> {
    const config = getConfig();

    if (config.mapSourceDirs === undefined || config.mapSourceDirs.length === 0) return [];

    const result = await fs.readdir(config.mapSourcePath);

    const dirs: SharedMapSourceDir[] = [];
    for (const r of result) {
        const fullDirPath = path.join(config.mapSourcePath, r);
        const stat = await fs.stat(fullDirPath);
        if (!stat.isDirectory()) continue;
        if (!config.mapSourceDirs.includes(r)) continue;

        let dirContents = await fs.readdir(fullDirPath);
        dirContents = dirContents.filter((f) => path.extname(f) === ".vmf");
        const dir: SharedMapSourceDir = {
            dirName: r,
            vmfNames: dirContents,
        };
        dirs.push(dir);
    }

    return dirs;
}
