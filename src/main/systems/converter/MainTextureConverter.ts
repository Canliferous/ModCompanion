import { SharedTextureAsset } from "Shared/SharedAsset.js";
import { createVtf } from "../MainMaretfSystem.js";
import { getConfig } from "../MainConfigSystem.js";
import path from "path";
import { filename } from "pathe/utils";

export async function _convertTextureAsset(asset: SharedTextureAsset): Promise<boolean> {
    if (asset.contentFiles === undefined || asset.contentFiles?.length === 0) return false;

    const srcFileRel = asset.contentFiles[0];
    const config = getConfig();
    const srcFile = path.join(config.textureSourcePath, srcFileRel);

    const vtfFileName = filename(srcFileRel) + ".vtf";
    const outFile = path.join(config.textureOutputPath, path.dirname(srcFileRel), vtfFileName);
    return createVtf(srcFile, outFile);
}
