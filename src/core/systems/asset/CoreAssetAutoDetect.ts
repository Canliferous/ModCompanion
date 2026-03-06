import path from "path";
import { createTextureAssetDefinition } from "./CoreAssetCreateTexture.js";
import { getAssetFromFile } from "./CoreAssetRepository.js";
import * as Shared from "mod_companion_shared";

export function detectPotentialAssets(contentTree: string[]): Shared.Asset.SharedAsset[] {
    const assets: Shared.Asset.SharedAsset[] = [];
    for (const file of contentTree) {
        const isTexture = Shared.FileEndings.isTextureFileEnding(path.extname(file));
        if (isTexture) {
            if (!file.includes("_hr")) continue;
            if (getAssetFromFile(file) !== undefined) continue;

            assets.push({
                defFilePath: file,
                def: createTextureAssetDefinition(file),
            });
        }
    }
    return assets;
}
