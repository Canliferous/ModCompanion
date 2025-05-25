import { ipcMain } from "electron";
import { IpcChannels } from "./IpcChannels.js";
import { getConfig } from "../systems/config-system.js";
import fs from "fs/promises";
import path from "path";
import { MapSourceDir } from "../../shared/SharedMapTypes.js";

export function registerMapScannerApi(): boolean {
    ipcMain.handle(IpcChannels.MapListSourceDirs, listMapSourceDirs);
    return true;
}

export async function listMapSourceDirs(): Promise<MapSourceDir[]> {
    const config = getConfig();

    const result = await fs.readdir(config.mapSourcePath);

    const dirs: MapSourceDir[] = [];
    for (const r of result) {
        const fullDirPath = path.join(config.mapSourcePath, r);
        const stat = await fs.stat(fullDirPath);
        if (!stat.isDirectory()) continue;
        if (!config.mapSourceDirs.includes(r)) continue;

        let dirContents = await fs.readdir(fullDirPath);
        dirContents = dirContents.filter((f) => path.extname(f) === ".vmf");
        const dir: MapSourceDir = {
            dirName: r,
            vmfNames: dirContents,
        };
        dirs.push(dir);
    }

    return dirs;
}
