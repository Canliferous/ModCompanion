import { getAssetMap } from "./assets/MainAssetRepository.js";
import { SharedAsset, SharedAssetHash, SharedAssetType, SharedTextureAsset } from "Shared/SharedAsset.js";
import { SharedConversion, SharedConversionState } from "Shared/SharedConversion.js";
import { notifyConversionsUpdated } from "../api/MainConversionApi.js";

let agentInterval: NodeJS.Timeout | undefined;
const conversions: Map<SharedAssetHash, SharedConversion> = new Map<SharedAssetHash, SharedConversion>();

export function initConvertAgentSystem(): boolean {
    return true;
}

export function startConversionAgent(): void {
    if (!agentInterval) {
        agentInterval = setInterval(_runAgent, 500);
    }
}

export function stopConversionAgent(): void {
    if (agentInterval) {
        clearInterval(agentInterval);
    }
}

function _runAgent(): void {
    let updated = _updateConversionStates(getAssetMap().values());

    if (updated) {
        notifyConversionsUpdated({ conversions });
    }
}

function _updateConversionStates(assets: MapIterator<SharedAsset>): boolean {
    let updated = false;
    for (let asset of assets) {
        if (_updateConversionState(asset)) {
            updated = true;
        }
    }
    return updated;
}

function _updateConversionState(asset: SharedAsset): boolean {
    const state = conversions.get(asset.hash)?.state ?? SharedConversionState.Unknown;
    const isConverted = _isConverted(asset);

    if (!isConverted && state === SharedConversionState.Unknown) {
        conversions.set(asset.hash, { hash: asset.hash, state: SharedConversionState.Pending });
        return true;
    }

    if (isConverted && state !== SharedConversionState.Finished) {
        if (conversions.has(asset.hash)) {
            conversions.get(asset.hash)!.state = SharedConversionState.Finished;
        } else {
            conversions.set(asset.hash, { hash: asset.hash, state: SharedConversionState.Finished });
        }
        return true;
    }

    return false;
}

export function _isConverted(asset: SharedAsset): boolean {
    switch (asset.type) {
        case SharedAssetType.Texture: {
            return _isTextureConverted(asset as SharedTextureAsset);
        }
        // Materials need no conversion. They only live in game
        case SharedAssetType.Material: {
            return true;
        }
        // There's no way to convert an invalid asset so we just say it is converted
        case SharedAssetType.Unknown:
        default:
            return true;
    }
}

export function _isTextureConverted(asset: SharedTextureAsset): boolean {
    return asset.gameFiles.length > 0;
}
