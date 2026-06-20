import { StrataInteropSystem } from "./CoreStrataInteropSystem.js";
import { Logger } from "./CoreLogSystem.js";
import * as Shared from "mod_companion_shared";
import { FileBrowserSystem } from "./CoreFileBrowserSystem.js";
import path from "path";

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
    if (!hotReloadEnabled || !StrataInteropSystem.isConnected()) return;

    const name = path.basename(filePath);
    const ext = path.extname(name);

    if (name === Shared.FileNames.chamberSignConfig) {
        Logger.info(Shared.Log.Channel.HotReload, "Reloading chamber sign config");
        StrataInteropSystem.sendCommand("portal_reload_chamber_signs");
        return;
    }

    if (ext === ".vtf") {
        const vtfPath = Shared.Vmt.absolutePathToMaterialPath(filePath);
        Logger.info(Shared.Log.Channel.HotReload, "Reloading texture", vtfPath);
        StrataInteropSystem.sendCommand(`mat_reloadtexture ${vtfPath}`);
        return;
    }

    if (ext === ".vmt") {
        const vmtPath = Shared.Vmt.absolutePathToMaterialPath(filePath);
        Logger.info(Shared.Log.Channel.HotReload, "Reloading material", vmtPath);
        StrataInteropSystem.sendCommand(`mat_reloadmaterial ${vmtPath}`);
        return;
    }
}
