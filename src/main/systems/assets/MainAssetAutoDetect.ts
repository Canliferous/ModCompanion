import path from "path";
import SharedConstants from "Shared/SharedConstants.js";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { createTextureAssetDefinition } from "./MainAssetCreateTexture.js";
import { getAssetFromFile } from "./MainAssetRepository.js";

export function detectPotentialAssets(contentTree: string[]): SharedAsset[] {
    const assets: SharedAsset[] = [];
    for (const file of contentTree) {
        const isTexture = SharedConstants.isTextureFileEnding(path.extname(file));
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
