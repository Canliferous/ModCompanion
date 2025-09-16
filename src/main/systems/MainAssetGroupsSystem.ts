import fs from "fs/promises";
import { SharedAssetGroup, SharedAssetGroupDefinition } from "Shared/SharedAssetGroup.js";
import path from "path";
import { existsSync } from "fs";
import { notifyAssetGroupsUpdated } from "../api/MainAssetGroupsApi.js";
import { getConfig } from "./MainConfigSystem.js";
import { v4 } from "uuid";

let groups: SharedAssetGroup[] = [];

export function getAssetGroupDir(): string {
    return path.join(getConfig().contentPath, "_modcomp_asset_groups");
}

export async function initAssetGroupsSystem(): Promise<boolean> {
    const dir = getAssetGroupDir();
    if (!existsSync(dir)) {
        await fs.mkdir(dir);
    }

    return true;
}

export async function writeAssetGroup(assetGroupDef: SharedAssetGroupDefinition): Promise<SharedAssetGroup> {
    const filePath = path.join(getAssetGroupDir(), v4() + ".json");
    const contents = JSON.stringify(assetGroupDef);
    await fs.writeFile(filePath, contents);
    console.log("Wrote asset group", filePath, assetGroupDef);
    return { filePath, def: assetGroupDef };
}

export async function scanAssetGroups() {
    console.trace();
    const startTime = new Date().getTime();
    groups = [];
    const dir = getAssetGroupDir();
    const dirItems = await fs.readdir(dir);
    console.log(dir, dirItems);
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

    notifyAssetGroupsUpdated({ groups });
}
