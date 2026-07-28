import * as pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import * as Shared from "mod_companion_shared";

export function openMca(asset: Shared.Asset.Asset): void {
    const p = asset.defFilePath;
    if (!p) return;
    window.electronAPI.fileBrowser.open(pathe.join(getAppConfig().rootPath, p));
}

export function exploreToMca(asset: Shared.Asset.Asset): void {
    const p = asset.defFilePath;
    if (!p) return;
    window.electronAPI.fileBrowser.browseTo(pathe.join(getAppConfig().rootPath, p));
}

export function browseToMca(asset: Shared.Asset.Asset): void {
    const p = asset.defFilePath;
    if (!p) return;
    // TODO: Implement this
}

export function openAssociatedFile(associatedFile: string): void {
    window.electronAPI.fileBrowser.open(pathe.join(getAppConfig().rootPath, associatedFile));
}
