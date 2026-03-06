import path from "path";
import fs from "fs/promises";
import { getAppConfig } from "../CoreConfigSystem.js";
import * as Shared from "mod_companion_shared";

export async function buildAssets(contentTree: string[]): Promise<Shared.Asset.SharedAssetMap> {
    const assets: Shared.Asset.SharedAssetMap = new Map<Shared.Asset.AssetId, Shared.Asset.SharedAsset>();
    const rootPath = getAppConfig().rootPath;

    for (const filePath of contentTree) {
        if (!_isAssetDefinitionFile(filePath)) continue;

        const definition = await _readAssetDefinitionFile(filePath, rootPath);
        if (definition === undefined) {
            console.warn(`Asset definition file ${filePath} is invalid and will be ignored`);
            continue;
        }

        const duplicateOther = assets.get(definition.id);
        if (duplicateOther !== undefined) {
            console.warn(
                `Asset definition file ${filePath} has the same id as ${duplicateOther.def.id} (${definition.id}) and will be ignored`,
            );
            continue;
        }

        const asset: Shared.Asset.SharedAsset = {
            def: definition,
            defFilePath: filePath,
        };
        assets.set(definition.id, asset);
    }

    return assets;
}

function _isAssetDefinitionFile(filePath: string): boolean {
    return path.extname(filePath).toLowerCase() === Shared.Asset.SharedAssetDefinitionFileExtension;
}

async function _readAssetDefinitionFile(
    filePath: string,
    fileRootPath: string,
): Promise<Shared.Asset.SharedAssetDefinition | undefined> {
    const fullPath = path.join(fileRootPath, filePath);
    const text = await fs.readFile(fullPath, "utf-8");
    const unk = JSON.parse(text);

    if (unk.type === undefined) {
        console.warn(`Asset definition file ${filePath} has no type`);
        return undefined;
    }
    if (unk.id === undefined) {
        console.warn(`Asset definition file ${filePath} has no id`);
        return undefined;
    }
    if (!Shared.Asset.isValidAssetType(unk.type)) {
        console.warn(`Asset definition file ${filePath} has invalid type ${unk.type}`);
        return undefined;
    }

    return unk;
}
