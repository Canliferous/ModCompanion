import { isTextureAsset, SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { getAssetMap } from "./assets/MainAssetRepository.js";
import { StrataInteropSystem } from "./MainStrataInteropSystem.js";

let hotReloadEnabled = false;

export function initHotReloadSystem(): boolean {
    return true;
}

export function setHotReloadEnabled(enabled: boolean): void {
    hotReloadEnabled = enabled;
}

export function requestHotReload(assets: SharedAssetId[]): void {
    if (!hotReloadEnabled || !StrataInteropSystem.isConnected()) return;

    let texturesToReload: string[] = [];
    for (const assetId of assets) {
        const asset = getAssetMap().get(assetId);
        if (asset === undefined) continue;

        if (isTextureAsset(asset)) {
            const files = asset.def.gameFiles;
            if (files === undefined || files.length === 0) continue;
            const fullVtfPath = files[0];

            const sanitizedVtfPath = fullVtfPath.replace("materials/", "").replace(".vtf", "");

            texturesToReload.push(sanitizedVtfPath);
        }
    }

    // Get rid of duplicates
    texturesToReload = Array.from(new Set(texturesToReload));

    for (const vtf of texturesToReload) {
        console.log("Reloading texture", vtf);
        StrataInteropSystem.sendCommand(`mat_reloadtexture ${vtf}`);
    }
}
