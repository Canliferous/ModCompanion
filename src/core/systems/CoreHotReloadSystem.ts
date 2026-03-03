import { isTextureAsset, SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { getAssetMap } from "~/systems/asset/CoreAssetRepository.js";
import { StrataInteropSystem } from "./CoreStrataInteropSystem.js";
import { Logger } from "./CoreLogSystem.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";

let hotReloadEnabled = false;

export const HotReloadSystem = {
    setEnabled(enabled: boolean): void {
        hotReloadEnabled = enabled;
    },
    requestHotReload(assets: SharedAssetId[]): void {
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
            Logger.info(SharedLogChannel.HotReload, "Reloading texture", vtf);
            StrataInteropSystem.sendCommand(`mat_reloadtexture ${vtf}`);
        }
    },
    reloadChamberSignConfig(): void {
        if (!hotReloadEnabled || !StrataInteropSystem.isConnected()) return;

        StrataInteropSystem.sendCommand("portal_reload_chamber_signs");
    },
};
