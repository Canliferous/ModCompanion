import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import { usePanelsManagerStore } from "~/store/PanelsManagerStore.js";
import * as Shared from "mod_companion_shared";

export function openMca(asset: Shared.Asset.Asset): void {
    const p = asset.defFilePath;
    if (!p) return;
    window.electronAPI.fileBrowser.openFile(pathe.join(getAppConfig().rootPath, p));
}

export function exploreToMca(asset: Shared.Asset.Asset): void {
    const p = asset.defFilePath;
    if (!p) return;
    window.electronAPI.fileBrowser.browseToFile(pathe.join(getAppConfig().rootPath, p));
}

export function browseToMca(asset: Shared.Asset.Asset): void {
    const p = asset.defFilePath;
    if (!p) return;
    usePanelsManagerStore().openFileBrowser(asset.defFilePath);
}

export function openAssociatedFile(associatedFile: string): void {
    window.electronAPI.fileBrowser.openFile(pathe.join(getAppConfig().rootPath, associatedFile));
}
