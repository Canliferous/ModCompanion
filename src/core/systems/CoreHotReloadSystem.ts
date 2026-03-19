import { AssetRepositorySystem } from "./asset/CoreAssetRepositorySystem.js";
import { StrataInteropSystem } from "./CoreStrataInteropSystem.js";
import { Logger } from "./CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

let hotReloadEnabled = false;

export const HotReloadSystem = {
    setEnabled(enabled: boolean): void {
        hotReloadEnabled = enabled;
    },
    requestHotReload(assets: Shared.Asset.AssetId[]): void {
        if (!hotReloadEnabled || !StrataInteropSystem.isConnected()) return;

        let texturesToReload: string[] = [];
        for (const assetId of assets) {
            const asset = AssetRepositorySystem.getAssetFromId(assetId);
            if (asset === undefined) continue;

            if (Shared.Asset.isTextureAsset(asset)) {
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
            Logger.info(Shared.Log.Channel.HotReload, "Reloading texture", vtf);
            StrataInteropSystem.sendCommand(`mat_reloadtexture ${vtf}`);
        }
    },
    reloadChamberSignConfig(): void {
        if (!hotReloadEnabled || !StrataInteropSystem.isConnected()) return;

        StrataInteropSystem.sendCommand("portal_reload_chamber_signs");
    },
};
