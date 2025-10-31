import fs from "fs/promises";
import { SharedAssetGroup, SharedAssetGroupDefinition, SharedAssetGroupId } from "Shared/SharedAssetGroup.js";
import path from "path";
import { existsSync } from "fs";
import { notifyAssetGroupsUpdated } from "../api/MainAssetGroupsApi.js";
import { getAppConfig } from "./MainConfigSystem.js";
import { v4 } from "uuid";
import { filename } from "pathe/utils";

const groups: Map<SharedAssetGroupId, SharedAssetGroup> = new Map<SharedAssetGroupId, SharedAssetGroup>();

export const AssetGroupsSystem = {
    async initSystem(): Promise<boolean> {
        const dir = _getAssetGroupDir();
        if (!existsSync(dir)) {
            await fs.mkdir(dir);
        }

        return true;
    },
    generateId(): SharedAssetGroupId {
        return v4();
    },
    async write(id: SharedAssetGroupId, assetGroupDef: SharedAssetGroupDefinition): Promise<SharedAssetGroup> {
        const filePath = path.join(_getAssetGroupDir(), id + ".json");
        const contents = JSON.stringify(assetGroupDef);
        await fs.writeFile(filePath, contents);
        console.log("Wrote asset group", filePath, assetGroupDef);
        return { filePath, def: assetGroupDef, id };
    },
    delete(id: SharedAssetGroupId) {
        const filePath = path.join(_getAssetGroupDir(), id + ".json");
        return fs.rm(filePath);
    },
    async scan() {
        const startTime = new Date().getTime();
        groups.clear();
        const dir = _getAssetGroupDir();
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
    },
};

function _getAssetGroupDir(): string {
    return path.join(getAppConfig().contentPath, "_modcomp_asset_groups");
}
