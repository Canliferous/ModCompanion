import { ipcMain } from "electron";
import { IpcChannels } from "./IpcChannels.js";
import { getConfig } from "../systems/config-system.js";
import fs from "fs/promises";
import path from "path";

export function registerMapScannerApi(): boolean {
    ipcMain.on(IpcChannels.ListMapSourceDirs, (event) => {
        return listMapSourceDirs();
    });

    return true;
}

export async function listMapSourceDirs(): Promise<string[]> {
    const config = getConfig();

    const result = await fs.readdir(config.mapSourcePath);

    const dirs: string[] = [];
    for (const r of result) {
        const stat = await fs.stat(path.join(config.mapSourcePath, r));
        if (!stat.isDirectory()) continue;

        if (config.mapSourceDirs.includes(r)) {
            dirs.push(r);
        }
    }

    console.log(dirs);
    return dirs;
}
