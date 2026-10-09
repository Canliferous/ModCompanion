import fs from "fs/promises";
import * as pathe from "pathe";
import { existsSync } from "fs";
import { ConfigSystem } from "./CoreConfigSystem.js";
import * as uuid from "uuid";
import { filename } from "pathe/utils";
import * as Shared from "mod_companion_shared";
import { Logger } from "./CoreLogSystem.js";
import { RescanNotifyFunc } from "mod_companion_shared/SharedAssetGroup.js";

const groups: Map<Shared.AssetGroup.GroupId, Shared.AssetGroup.SharedAssetGroup> = new Map();
let notifyFunc: Shared.AssetGroup.RescanNotifyFunc | undefined = undefined;

export const AssetGroupsSystem = {
    async initSystem(func?: RescanNotifyFunc): Promise<boolean> {
        notifyFunc = func;
        const dir = _getAssetGroupDir();
        if (!existsSync(dir)) {
            await fs.mkdir(dir);
        }

        return true;
    },
    generateId(): Shared.AssetGroup.GroupId {
        return uuid.v4();
    },
    async write(
        id: Shared.AssetGroup.GroupId,
        assetGroupDef: Shared.AssetGroup.GroupDefinition,
    ): Promise<Shared.AssetGroup.SharedAssetGroup> {
        const filePath = pathe.join(_getAssetGroupDir(), id + ".json");
        const contents = JSON.stringify(assetGroupDef, null, 4);
        await fs.writeFile(filePath, contents);
        Logger.info(Shared.Log.Channel.Assets, "Wrote asset group", filePath, assetGroupDef);
        return { filePath, def: assetGroupDef, id };
    },
    delete(id: Shared.AssetGroup.GroupId) {
        const filePath = pathe.join(_getAssetGroupDir(), id + ".json");
        return fs.rm(filePath);
    },
    async scan() {
        const startTime = Date.now();
        groups.clear();
        const dir = _getAssetGroupDir();
        const dirItems = await fs.readdir(dir);
        for (const dirItem of dirItems) {
            if (!dirItem.endsWith(".json")) continue;
            const dirItemFull = pathe.join(dir, dirItem);
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

        const endTime = Date.now();
        Logger.info(Shared.Log.Channel.Assets, `Loaded ${groups.size} asset groups in ${endTime - startTime}ms`);

        notifyFunc?.({ groups });
    },
};

function _getAssetGroupDir(): string {
    return pathe.join(ConfigSystem.getAppConfig().contentPath, "_modcomp_asset_groups");
}
