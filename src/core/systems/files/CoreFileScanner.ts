import { getAppConfig } from "../CoreConfigSystem.js";
import path from "path";
import { timeMillisAsync } from "../../helpers/CoreTiming.js";
import fs from "fs/promises";
import { Logger } from "../CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

export async function scanContentTree(): Promise<string[]> {
    const config = getAppConfig();

    Logger.info(Shared.Log.Channel.Generic, "Scanning content directory...");
    const { millis: millisContent, result: contentTree } = await timeMillisAsync(() =>
        _listFilesRecursive(config.rootPath.length + 1, config.contentPath),
    );
    Logger.info(Shared.Log.Channel.Generic, `Scanned content directory in ${millisContent}ms`);
    return contentTree;
}

const alwaysIgnoreFolderNames = ["node_modules", ".idea"];

async function _listFilesRecursive(baseDirLength: number, dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir);

    const files: string[] = [];
    for (const entry of entries) {
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
