import { getAppConfig } from "../MainConfigSystem.js";
import path from "path";
import { timeMillisAsync } from "../../helpers/MainTiming.js";
import fs from "fs/promises";

export async function scanContentTree(): Promise<string[]> {
    const config = getAppConfig();

    console.log("Scanning content directory...");
    const { millis: millisContent, result: contentTree } = await timeMillisAsync(() =>
        _listFilesRecursive(config.rootPath.length + 1, config.contentPath),
    );
    console.log(`Scanned content directory in ${millisContent}ms`);
    return contentTree;
}

const alwaysIgnoreFolderNames = ["node_modules", ".idea"];

async function _listFilesRecursive(baseDirLength: number, dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir);

    const files: string[] = [];
    for (let entry of entries) {
        const entryPath = path.join(dir, entry);
        const stat = await fs.stat(entryPath);
        if (stat.isDirectory()) {
            if (alwaysIgnoreFolderNames.includes(entry)) continue;

            files.push(...(await _listFilesRecursive(baseDirLength, entryPath)));
        }

        if (stat.isFile()) {
            const file = entryPath.substring(baseDirLength).replaceAll("\\", "/");
            files.push(file);
        }
    }

    return files;
}
