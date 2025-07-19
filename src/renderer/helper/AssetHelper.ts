import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";

export function openMca(asset: SharedAsset): void {
    const p = asset.defFilePath;
    if (!p) return;
    window.electronAPI.app.openFile(pathe.join(getAppConfig().contentPath, p));
}

export function browseToMca(asset: SharedAsset): void {
    const p = asset.defFilePath;
    if (!p) return;
    window.electronAPI.app.browseToFile(pathe.join(getAppConfig().contentPath, p));
}
