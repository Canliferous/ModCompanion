import {
    isTextureAsset,
    SharedAssetDefinition,
    SharedAssetMap,
    SharedTextureAssetDefinition,
} from "Shared/SharedAssetDefinition.js";
import { SharedVtfFlag, SharedVtfFlags } from "Shared/vtf/SharedVtfFlag.js";
import { writeAssetDef } from "./MainAssetRepository.js";

export async function maintainAssets(assets: SharedAssetMap) {
    const startTime = new Date();
    console.log("Maintaining assets...");

    for (let asset of assets.values()) {
        let newAsset: SharedAssetDefinition | undefined = undefined;
        if (isTextureAsset(asset)) {
            newAsset = _maintainTextureAsset(asset.def);
        }

        if (newAsset !== undefined && asset.defFilePath) {
            const writtenAsset = await writeAssetDef(newAsset, asset.defFilePath);
            assets.set(newAsset.id, writtenAsset);
        }
    }

    const endTime = new Date();
    console.log(`Asset maintenance done. Took ${endTime.getTime() - startTime.getTime()}ms`);
}

function _maintainTextureAsset(asset: SharedTextureAssetDefinition): SharedTextureAssetDefinition | undefined {
    const def: SharedTextureAssetDefinition = structuredClone(asset);
    let changed = false;

    if (asset.vtfOptions) {
        if (asset.vtfOptions.flags) {
            const flags = asset.vtfOptions.flags as string[];
            const realFlags = Object.values(SharedVtfFlags) as string[];
            const cleanedFlags = flags.filter((f) => {
                const good = realFlags.includes(f);

                if (!good) {
                    console.log(`Texture Asset ${def.displayName} ${def.id} has bad vtf flag ${f}. Removing...`);
                }

                return good;
            }) as SharedVtfFlag[];
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
