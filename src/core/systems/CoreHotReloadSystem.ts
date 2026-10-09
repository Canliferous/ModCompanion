import { GameInteropSystem } from "./CoreGameInteropSystem.js";
import { Logger } from "./CoreLogSystem.js";
import * as Shared from "mod_companion_shared";
import { FileBrowserSystem } from "./CoreFileBrowserSystem.js";
import * as pathe from "pathe";

let hotReloadEnabled = false;

export const HotReloadSystem = {
    initSystem(): boolean {
        FileBrowserSystem.getFileChangedEvent().on(_handleFileChanged);
        return true;
    },
    setEnabled(enabled: boolean): void {
        hotReloadEnabled = enabled;
    },
};

function _handleFileChanged(filePath: string) {
    if (!hotReloadEnabled || !GameInteropSystem.isConnected()) return;

    const name = pathe.basename(filePath);
    const ext = pathe.extname(name);

    if (name === Shared.FileNames.chamberSignConfig) {
        Logger.info(Shared.Log.Channel.HotReload, "Reloading chamber sign config");
        GameInteropSystem.sendCommand("portal_reload_chamber_signs");
        return;
    }

    if (ext === ".vtf") {
        const vtfPath = Shared.Vmt.rootRelativeToMaterialPath(filePath);
        Logger.info(Shared.Log.Channel.HotReload, "Reloading texture", vtfPath);
        GameInteropSystem.sendCommand(`mat_reloadtexture ${vtfPath}`);
        return;
    }

    if (ext === ".vmt") {
        const vmtPath = Shared.Vmt.rootRelativeToMaterialPath(filePath);
        Logger.info(Shared.Log.Channel.HotReload, "Reloading material", vmtPath);
        GameInteropSystem.sendCommand(`mat_reloadmaterial ${vmtPath}`);
        return;
    }
}
