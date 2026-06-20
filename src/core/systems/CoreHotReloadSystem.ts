import { AssetRepositorySystem } from "./asset/CoreAssetRepositorySystem.js";
import { StrataInteropSystem } from "./CoreStrataInteropSystem.js";
import { Logger } from "./CoreLogSystem.js";
import * as Shared from "mod_companion_shared";
import { FileBrowser } from "mod_companion_shared";
import { FileBrowserSystem } from "./CoreFileBrowserSystem.js";
import path from "path";
import { absolutePathToMaterialPath } from "mod_companion_shared/SharedVmt.js";

let hotReloadEnabled = false;

export const HotReloadSystem = {
    initSystem(): boolean {
        FileBrowserSystem.getFileChangedEvent().on(_handleFileChanged);
        return true;
    },
    setEnabled(enabled: boolean): void {
        hotReloadEnabled = enabled;
    },
    requestHotReload(assets: Shared.Asset.AssetId[]): void {
        // Todo: Texture hot reloading should probably just be file-write based so it works for not just asset textures
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
};

function _handleFileChanged(filePath: string) {
    if (!hotReloadEnabled || !StrataInteropSystem.isConnected()) return;

    const name = path.basename(filePath);
    const ext = path.extname(name);

    if (name === Shared.FileNames.chamberSignConfig) {
        Logger.info(Shared.Log.Channel.HotReload, "Reloading chamber sign config");
        StrataInteropSystem.sendCommand("portal_reload_chamber_signs");
        return;
    }

    // Todo: Texture hot reloading should probably just be file-write based so it works for not just asset textures
    // if (ext === ".vtf") {
    //     const vtfPath = Shared.Vmt.absolutePathToMaterialPath(filePath);
    //     Logger.info(Shared.Log.Channel.HotReload, "Reloading texture", vtfPath);
    //     StrataInteropSystem.sendCommand(`mat_reloadtexture ${vtfPath}`);
    //     return;
    // }

    if (ext === ".vmt") {
        const vmtPath = Shared.Vmt.absolutePathToMaterialPath(filePath);
        Logger.info(Shared.Log.Channel.HotReload, "Reloading material", vmtPath);
        StrataInteropSystem.sendCommand(`mat_reloadmaterial ${vmtPath}`);
        return;
    }
}
