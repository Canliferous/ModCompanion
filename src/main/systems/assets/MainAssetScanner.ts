import { isValidAssetType, SharedAsset, SharedAssetId, SharedAssetMap } from "Shared/SharedAsset.js";
import path from "path";
import fs from "fs/promises";

export const AssetDefinitionFileExtension = ".mca"; // Mod Companion Asset

export async function buildAssets(contentTree: string[], contentRootPath: string): Promise<SharedAssetMap> {
    const assets: SharedAssetMap = new Map<SharedAssetId, SharedAsset>();

    for (let filePath of contentTree) {
        if (!_isAssetDefinitionFile(filePath)) continue;

        const asset = await _readAssetDefinitionFile(filePath, contentRootPath);
        if (asset === undefined) {
            console.warn(`Asset definition file ${filePath} is invalid and will be ignored`);
            continue;
        }

        const duplicateOther = assets.get(asset.id);
        if (duplicateOther !== undefined) {
            console.warn(
                `Asset definition file ${filePath} has the same id as ${duplicateOther.id} (${asset.id}) and will be ignored`,
            );
            continue;
        }
        assets.set(asset.id, asset);
    }

    return assets;
}

function _isAssetDefinitionFile(filePath: string): boolean {
    return path.extname(filePath).toLowerCase() === AssetDefinitionFileExtension;
}

async function _readAssetDefinitionFile(filePath: string, fileRootPath: string): Promise<SharedAsset | undefined> {
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
