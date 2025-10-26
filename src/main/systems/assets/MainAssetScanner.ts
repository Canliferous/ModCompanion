import {
    isValidAssetType,
    SharedAsset,
    SharedAssetDefinition,
    SharedAssetDefinitionFileExtension,
    SharedAssetId,
    SharedAssetMap,
} from "Shared/SharedAssetDefinition.js";
import path from "path";
import fs from "fs/promises";
import { getAppConfig } from "../MainConfigSystem.js";

export async function buildAssets(contentTree: string[]): Promise<SharedAssetMap> {
    const assets: SharedAssetMap = new Map<SharedAssetId, SharedAsset>();
    const rootPath = getAppConfig().rootPath;

    for (let filePath of contentTree) {
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

        const asset: SharedAsset = {
            def: definition,
            defFilePath: filePath,
        };
        assets.set(definition.id, asset);
    }

    return assets;
}

function _isAssetDefinitionFile(filePath: string): boolean {
    return path.extname(filePath).toLowerCase() === SharedAssetDefinitionFileExtension;
}

async function _readAssetDefinitionFile(
    filePath: string,
    fileRootPath: string,
): Promise<SharedAssetDefinition | undefined> {
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
    if (!isValidAssetType(unk.type)) {
        console.warn(`Asset definition file ${filePath} has invalid type ${unk.type}`);
        return undefined;
    }

    return unk;
}
