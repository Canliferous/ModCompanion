import path from "path";
import { MareTfSystem } from "../../systems/CoreMaretfSystem.js";
import { ConfigSystem } from "../../systems/CoreConfigSystem.js";
import * as Shared from "mod_companion_shared";

export const TextureConverter = {
    isValid(asset: Shared.Asset.TextureAssetDef): boolean {
        return (
            asset.contentFiles !== undefined &&
            asset.contentFiles?.length === 1 &&
            asset.gameFiles !== undefined &&
            asset.gameFiles?.length === 1
        );
    },
    async convert(asset: Shared.Asset.TextureAssetDef): Promise<string | undefined> {
        if (!this.isValid(asset)) return undefined;
        const srcFileRel = asset.contentFiles![0];
        const config = ConfigSystem.getAppConfig();
        const srcFile = path.join(config.contentPath, srcFileRel);

        const outFileRel = asset.gameFiles![0];
        const outFile = path.join(config.gamePath, outFileRel);

        let options = config.assetDefaults?.vtfOptions ?? {};
        options = { ...options, ...asset.vtfOptions };
        return MareTfSystem.createVtf(srcFile, outFile, options);
    },
};
