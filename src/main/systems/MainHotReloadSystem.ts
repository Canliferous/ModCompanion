import { SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { runStrataGameCommand } from "./MainStrataInteropSystem.js";

let hotReloadEnabled = false;

export function initHotReloadSystem(): boolean {
    return true;
}

export function setHotReloadEnabled(enabled: boolean): void {
    hotReloadEnabled = enabled;
}

export function requestHotReload(assets: SharedAssetId[]): void {
    if (!hotReloadEnabled) return;

    console.log("Hot reloading");
    runStrataGameCommand("mat_reloadallmaterials ");
}
