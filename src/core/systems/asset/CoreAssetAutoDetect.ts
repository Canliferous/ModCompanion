import path from "path";
import { createTextureAssetDefinition } from "./CoreAssetCreateTexture.js";
import { AssetRepositorySystem } from "./CoreAssetRepositorySystem.js";
import * as Shared from "mod_companion_shared";

export function detectPotentialAssets(contentTree: string[]): Shared.Asset.Asset[] {
    const assets: Shared.Asset.Asset[] = [];
    for (const file of contentTree) {
        const isTexture = Shared.FileEndings.isTextureFileEnding(path.extname(file));
        if (isTexture) {
            if (!file.includes("_hr")) continue;
            if (AssetRepositorySystem.getAssetFromFile(file) !== undefined) continue;

            assets.push({
                defFilePath: file,
                def: createTextureAssetDefinition(file),
            });
        }
    }
    return assets;
}
