import { SharedTextureAssetDefinition } from "Shared/SharedAssetDefinition.js";
import { createVtf } from "../MainMaretfSystem.js";
import { getConfig } from "../MainConfigSystem.js";
import path from "path";
import { AssetState, AssetStates } from "../MainConversionAgentSystem.js";
import fs from "fs/promises";

export async function convertTextureAsset(asset: SharedTextureAssetDefinition): Promise<string | undefined> {
    if (asset.contentFiles === undefined || asset.contentFiles?.length !== 1) return undefined;
    if (asset.gameFiles === undefined || asset.gameFiles?.length !== 1) return undefined;

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

export async function determineTextureAssetState(asset: SharedTextureAssetDefinition): Promise<AssetState> {
    if (asset.contentFiles === undefined || asset.contentFiles?.length !== 1) return AssetStates.Invalid;
    if (asset.gameFiles === undefined || asset.gameFiles?.length !== 1) return AssetStates.Invalid;

    const p = path.join(getConfig().gamePath, asset.gameFiles[0]);
    try {
        const stat = await fs.stat(p);
        if (stat.isFile()) {
            return AssetStates.HasOutputFiles;
        } else {
            return AssetStates.NoOutputFiles;
        }
    } catch (e) {
        return AssetStates.NoOutputFiles;
    }
}
