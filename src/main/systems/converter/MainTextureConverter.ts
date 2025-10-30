import { SharedTextureAssetDefinition } from "Shared/SharedAssetDefinition.js";
import { createVtf } from "../MainMaretfSystem.js";
import { getAppConfig } from "../MainConfigSystem.js";
import path from "path";

export async function convertTextureAsset(asset: SharedTextureAssetDefinition): Promise<string | undefined> {
    if (asset.contentFiles === undefined || asset.contentFiles?.length !== 1) return undefined;
    if (asset.gameFiles === undefined || asset.gameFiles?.length !== 1) return undefined;

    const srcFileRel = asset.contentFiles[0];
    const config = getAppConfig();
    const srcFile = path.join(config.contentPath, srcFileRel);

    const outFileRel = asset.gameFiles[0];
    const outFile = path.join(config.gamePath, outFileRel);

    let options = config.assetDefaults?.vtfOptions ?? {};
    options = { ...options, ...asset.vtfOptions };
    console.log(`Converting texture ${srcFile} -> ${outFile}`, options);
    return createVtf(srcFile, outFile, options);
}
