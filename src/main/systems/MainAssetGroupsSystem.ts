import fs from "fs/promises";
import { SharedAssetGroup, SharedAssetGroupDefinition, SharedAssetGroupId } from "Shared/SharedAssetGroup.js";
import path from "path";
import { existsSync } from "fs";
import { notifyAssetGroupsUpdated } from "../api/MainAssetGroupsApi.js";
import { getConfig } from "./MainConfigSystem.js";
import { v4 } from "uuid";
import { filename } from "pathe/utils";

const groups: Map<SharedAssetGroupId, SharedAssetGroup> = new Map<SharedAssetGroupId, SharedAssetGroup>();

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

export function generateAssetGroupId(): SharedAssetGroupId {
    return v4();
}

export async function writeAssetGroup(
    id: SharedAssetGroupId,
    assetGroupDef: SharedAssetGroupDefinition,
): Promise<SharedAssetGroup> {
    const filePath = path.join(getAssetGroupDir(), id + ".json");
    const contents = JSON.stringify(assetGroupDef);
    await fs.writeFile(filePath, contents);
    console.log("Wrote asset group", filePath, assetGroupDef);
    return { filePath, def: assetGroupDef, id };
}

export async function scanAssetGroups() {
    const startTime = new Date().getTime();
    groups.clear();
    const dir = getAssetGroupDir();
    const dirItems = await fs.readdir(dir);
    for (const dirItem of dirItems) {
        if (!dirItem.endsWith(".json")) continue;
        const dirItemFull = path.join(dir, dirItem);
        const stat = await fs.stat(dirItemFull);
        if (!stat.isFile()) continue;

        const id = filename(dirItem);
        if (id === undefined) {
            continue;
        }
        if (groups.has(id)) {
            console.warn("Duplicate asset group id", id);
            continue;
        }

        const fileContentsString = await fs.readFile(dirItemFull, "utf-8");
        const fileContentObj = JSON.parse(fileContentsString);

        groups.set(id, { filePath: dirItemFull, def: fileContentObj, id });
    }

    const endTime = new Date().getTime();
    console.log(`Loaded ${groups.size} asset groups in ${endTime - startTime}ms`);

    notifyAssetGroupsUpdated({ groups });
}
