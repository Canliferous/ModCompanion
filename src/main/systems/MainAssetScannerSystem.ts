import fs from "fs/promises";
import path from "path";
import {getConfig} from "./MainConfigSystem.js";

export function initAssetScannerSystem(): boolean {

    const config = getConfig();
    _listFilesRecursive(config.contentPath).then(files => console.log(files));

    return true;
}

async function _listFilesRecursive(startDir: string): Promise<string[]> {
    const entries = await fs.readdir(startDir);

    const files: string[] = [];
    for (let entry of entries) {
        const entryPath = path.join(startDir, entry);
        const stat = await fs.stat(entryPath);
        if(stat.isDirectory()) {
            files.push(...(await _listFilesRecursive(entryPath)));
        } else {
            files.push(entryPath);
        }
    }

    return files;
}