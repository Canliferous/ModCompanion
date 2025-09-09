import { getConfig } from "../MainConfigSystem.js";
import path from "path";
import { SharedAssetGroupDefinition } from "Shared/SharedAssetGroup.js";
import fs from "fs/promises";
import { v4 } from "uuid";

export function getAssetGroupDir(): string {
    return path.join(getConfig().contentPath, "_modcomp_asset_groups");
}

export async function writeAssetGroup(assetGroupDef: SharedAssetGroupDefinition) {
    const fileName = path.join(getAssetGroupDir(), v4() + ".json");
    const contents = JSON.stringify(assetGroupDef);
    await fs.writeFile(fileName, contents);
    console.log("Wrote asset group", fileName, assetGroupDef);
}
