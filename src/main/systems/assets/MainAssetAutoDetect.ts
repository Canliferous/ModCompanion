import path from "path";
import SharedConstants from "Shared/SharedConstants.js";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { createTextureAssetDefinition } from "./MainAssetCreateTexture.js";
import { getAssetFromFile } from "./MainAssetRepository.js";

export function detectPotentialAssets(contentTree: string[]): SharedAsset[] {
    const assets: SharedAsset[] = [];
    for (const file of contentTree) {
        if (getAssetFromFile(file) !== undefined) {
            continue;
        }

        const isTexture = SharedConstants.isTextureFileEnding(path.extname(file));
        if (isTexture) {
            assets.push({
                defFilePath: file,
                def: createTextureAssetDefinition(file),
            });
        }
    }
    return assets;
}
