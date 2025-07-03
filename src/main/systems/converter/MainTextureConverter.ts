import { SharedTextureAssetDefinition } from "Shared/SharedAssetDefinition.js";
import { createVtf } from "../MainMaretfSystem.js";
import { getConfig } from "../MainConfigSystem.js";
import path from "path";
import { filename } from "pathe/utils";

export async function _convertTextureAsset(asset: SharedTextureAssetDefinition): Promise<boolean> {
    if (asset.contentFiles === undefined || asset.contentFiles?.length === 0) return false;
    if (asset.gameFiles === undefined || asset.gameFiles?.length === 0) return false;

    const srcFileRel = asset.contentFiles[0];
    const config = getConfig();
    const srcFile = path.join(config.contentPath, srcFileRel);

    const outFileRel = asset.gameFiles[0];
    const outFile = path.join(config.gamePath, outFileRel);

    let options = config.assetDefaults?.vtfOptions ?? {};
    options = { ...options, ...asset.vtfOptions };
    console.log(`Converting texture ${srcFile} -> ${outFile}`, options);
    return createVtf(srcFile, outFile, options);
}
