import { writeAssetDef } from "./CoreAssetRepository.js";
import { Logger } from "../CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

export async function maintainAssets(assets: Shared.Asset.SharedAssetMap) {
    const startTime = new Date();
    Logger.info(Shared.Log.Channel.Assets, `Maintaining assets...`);

    for (const asset of assets.values()) {
        let newAsset: Shared.Asset.SharedAssetDefinition | undefined = undefined;
        if (Shared.Asset.isTextureAsset(asset)) {
            newAsset = _maintainTextureAsset(asset.def);
        }

        if (newAsset !== undefined && asset.defFilePath) {
            const writtenAsset = await writeAssetDef(newAsset, asset.defFilePath);
            assets.set(newAsset.id, writtenAsset);
        }
    }

    const endTime = new Date();
    Logger.info(Shared.Log.Channel.Assets, `Asset maintenance done. Took ${endTime.getTime() - startTime.getTime()}ms`);
}

function _maintainTextureAsset(
    asset: Shared.Asset.SharedTextureAssetDefinition,
): Shared.Asset.SharedTextureAssetDefinition | undefined {
    const def: Shared.Asset.SharedTextureAssetDefinition = structuredClone(asset);
    let changed = false;

    if (asset.vtfOptions) {
        if (asset.vtfOptions.flags) {
            const flags = asset.vtfOptions.flags as string[];
            const realFlags = Object.values(Shared.Vtf.SharedVtfFlags) as string[];
            const cleanedFlags = flags.filter((f) => {
                const good = realFlags.includes(f);

                if (!good) {
                    Logger.info(
                        Shared.Log.Channel.Assets,
                        `Texture Asset ${def.displayName} ${def.id} has bad vtf flag ${f}. Removing...`,
                    );
                }

                return good;
            }) as Shared.Vtf.SharedVtfFlag[];
            if (cleanedFlags.length != flags.length) {
                def.vtfOptions!.flags = cleanedFlags;
                changed = true;
            }
        }
    }

    if (changed) {
        return def;
    } else {
        return undefined;
    }
}
