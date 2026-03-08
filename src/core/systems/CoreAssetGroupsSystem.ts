import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { ConfigSystem } from "./CoreConfigSystem.js";
import { v4 } from "uuid";
import { filename } from "pathe/utils";
import * as Shared from "mod_companion_shared";
import { Logger } from "./CoreLogSystem.js";

const groups: Map<Shared.AssetGroup.GroupId, Shared.AssetGroup.SharedAssetGroup> = new Map();

export const AssetGroupsSystem = {
    async initSystem(): Promise<boolean> {
        const dir = _getAssetGroupDir();
        if (!existsSync(dir)) {
            await fs.mkdir(dir);
        }

        return true;
    },
    generateId(): Shared.AssetGroup.GroupId {
        return v4();
    },
    async write(
        id: Shared.AssetGroup.GroupId,
        assetGroupDef: Shared.AssetGroup.GroupDefinition,
    ): Promise<Shared.AssetGroup.SharedAssetGroup> {
        const filePath = path.join(_getAssetGroupDir(), id + ".json");
        const contents = JSON.stringify(assetGroupDef);
        await fs.writeFile(filePath, contents);
        Logger.info(Shared.Log.Channel.Assets, "Wrote asset group", filePath, assetGroupDef);
        return { filePath, def: assetGroupDef, id };
    },
    delete(id: Shared.AssetGroup.GroupId) {
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
                Logger.warning(Shared.Log.Channel.Assets, "Duplicate asset group id", id);
                continue;
            }

            const fileContentsString = await fs.readFile(dirItemFull, "utf-8");
            const fileContentObj = JSON.parse(fileContentsString);

            groups.set(id, { filePath: dirItemFull, def: fileContentObj, id });
        }

        const endTime = new Date().getTime();
        Logger.info(Shared.Log.Channel.Assets, `Loaded ${groups.size} asset groups in ${endTime - startTime}ms`);

        // notifyAssetGroupsUpdated({ groups }); // todo
    },
};

function _getAssetGroupDir(): string {
    return path.join(ConfigSystem.getAppConfig().contentPath, "_modcomp_asset_groups");
}
