import fs from "fs/promises";
import { getAssetGroupDir } from "./assetGroups/MainAssetGroups.js";
import { SharedAssetGroup } from "Shared/SharedAssetGroup.js";
import path from "path";
import { existsSync } from "fs";

const groups: SharedAssetGroup[] = [];

export async function initAssetGroupsSystem(): Promise<boolean> {
    await _loadAssetGroups();

    return true;
}

async function _loadAssetGroups() {
    const startTime = new Date().getTime();
    const dir = getAssetGroupDir();

    if (!existsSync(dir)) {
        await fs.mkdir(dir);
    }
    const dirItems = await fs.readdir(dir);
    for (const dirItem of dirItems) {
        if (!dirItem.endsWith(".json")) continue;
        const dirItemFull = path.join(dir, dirItem);
        const stat = await fs.stat(dirItemFull);
        if (!stat.isFile()) continue;

        const fileContentsString = await fs.readFile(dirItemFull, "utf-8");
        const fileContentObj = JSON.parse(fileContentsString);

        groups.push({ filePath: dirItemFull, def: fileContentObj });
    }

    const endTime = new Date().getTime();
    console.log(`Loaded ${groups.length} asset groups in ${endTime - startTime}ms`);
}
