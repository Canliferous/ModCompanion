import { SharedTextureAssetDefinition } from "Shared/SharedAssetDefinition.js";
import { MareTfSystem } from "../MainMaretfSystem.js";
import { getAppConfig } from "../MainConfigSystem.js";
import path from "path";

export const TextureConverter = {
    isValid(asset: SharedTextureAssetDefinition): boolean {
        return (
            asset.contentFiles !== undefined &&
            asset.contentFiles?.length === 1 &&
            asset.gameFiles !== undefined &&
            asset.gameFiles?.length === 1
        );
    },
    async convert(asset: SharedTextureAssetDefinition): Promise<string | undefined> {
        if (!this.isValid(asset)) return undefined;
        const srcFileRel = asset.contentFiles![0];
        const config = getAppConfig();
        const srcFile = path.join(config.contentPath, srcFileRel);

        const outFileRel = asset.gameFiles![0];
        const outFile = path.join(config.gamePath, outFileRel);

        let options = config.assetDefaults?.vtfOptions ?? {};
        options = { ...options, ...asset.vtfOptions };
        return MareTfSystem.createVtf(srcFile, outFile, options);
    },
};
