import * as Shared from "mod_companion_shared";
import * as sourcelib from "sourcelib";
import { Logger } from "./CoreLogSystem.js";

const materialToTexturesMap = new Map<Shared.Asset.AssetId, Shared.Asset.AssetId[]>();

export const MaterialSystem = {
    initSystem(): boolean {
        return true;
    },

    buildMaterialTextureIndex(assetMap: Shared.Asset.AssetMap) {
        const { millis } = Shared.Timing.timeMillis(() => {
            _buildMaterialTextureIndex(assetMap, materialToTexturesMap);
        });

        Logger.info(Shared.Log.Channel.Assets, "Rebuilding texture index finished in", millis, "ms");
    },
};

function _buildMaterialTextureIndex(
    assetMap: Shared.Asset.AssetMap,
    indexMap: Map<Shared.Asset.AssetId, Shared.Asset.AssetId[]>,
) {
    const materialAssets: Shared.Asset.MaterialAssetDef[] = [];
    const textureAssets: Shared.Asset.TextureAssetDef[] = [];
    indexMap.clear();

    const textureParams = sourcelib.vmt.shaderParams.filter((p) => p.type === "texture");

    for (const [id, asset] of assetMap) {
        if (Shared.Asset.isMaterialAsset(asset)) {
            materialAssets.push(asset.def);
        } else if (Shared.Asset.isTextureAsset(asset)) {
            textureAssets.push(asset.def);
        }
    }

    for (const matAss of materialAssets) {
        if (!matAss || !matAss.vmtDocument) continue;

        for (const textureParam of textureParams) {
            const textureVal = matAss.vmtDocument[textureParam.name];
            if (textureVal === undefined) continue;
            if (typeof textureVal !== "string") continue;

            const texAss = textureAssets.find((t) => t.contentFiles?.includes(textureVal));
            if (!texAss) continue;

            if (!indexMap.has(matAss.id)) {
                indexMap.set(matAss.id, [texAss.id]);
            } else {
                indexMap.get(matAss.id)?.push(texAss.id);
            }
        }
    }
}
