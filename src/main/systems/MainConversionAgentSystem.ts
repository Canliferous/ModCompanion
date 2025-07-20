import { getAssetFromId, getAssetMap } from "./assets/MainAssetRepository.js";
import {
    SharedAsset,
    SharedAssetDefinition,
    SharedAssetId,
    SharedAssetType,
    SharedTextureAssetDefinition,
} from "Shared/SharedAssetDefinition.js";
import { SharedConversion, SharedConversionState } from "Shared/SharedConversion.js";
import { notifyConversionsUpdated } from "../api/MainConversionApi.js";
import { _convertTextureAsset } from "./converter/MainTextureConverter.js";
import { runStrataGameCommand } from "./MainStrataInteropSystem.js";
import { requestHotReload } from "./MainHotReloadSystem.js";

const MAX_PARALLEL_JOBS = 5;

type JobResult = boolean;
const conversionJobs: Map<SharedAssetId, Promise<JobResult>> = new Map<SharedAssetId, Promise<JobResult>>();

let agentInterval: NodeJS.Timeout | undefined;
const conversions: Map<SharedAssetId, SharedConversion> = new Map<SharedAssetId, SharedConversion>();

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

export function enqueue(assetId: string): void {
    console.log(`Enqueuing ${assetId} for forced conversion`);
    _setState(assetId, SharedConversionState.PendingForced);
}

function _runAgent(): void {
    const assetsIter = getAssetMap().values();
    let updated = _updateStaleStates(assetsIter);
    const assetsToConvert = _getAssetsToConvert();
    if (assetsToConvert.length > 0) {
        updated = true;
        _startConversions(assetsToConvert);
    }

    if (updated) {
        notifyConversionsUpdated({ conversions });
    }
}

function _getAssetsToConvert(): SharedAssetId[] {
    let newJobsCount = MAX_PARALLEL_JOBS - conversionJobs.size;
    if (newJobsCount === 0) return [];

    const result: SharedAssetId[] = [];

    for (const conv of conversions.values()) {
        if (newJobsCount === 0) break;

        const alreadyAdded = conversionJobs.has(conv.hash);
        const isPending =
            conv.state === SharedConversionState.Pending || conv.state === SharedConversionState.PendingForced;
        if (isPending && !alreadyAdded) {
            result.push(conv.hash);
            newJobsCount--;
        }
    }

    return result;
}

function _startConversions(ids: SharedAssetId[]): void {
    const promises: Promise<boolean>[] = [];
    for (const hash of ids) {
        const asset = getAssetFromId(hash);
        if (!asset) {
            _setState(hash, SharedConversionState.Unknown);
            continue;
        }
        _setState(hash, SharedConversionState.InProgress);

        const timeoutPromise = _convertAsset(asset.def);
        promises.push(timeoutPromise);
        timeoutPromise.finally(() => _onJobPromiseFinished(hash));
        conversionJobs.set(hash, timeoutPromise);
    }

    Promise.allSettled(promises).then((p) => {
        requestHotReload(ids);
    });
}

async function _convertAsset(asset: SharedAssetDefinition): Promise<boolean> {
    switch (asset.type) {
        case SharedAssetType.Texture:
            return _convertTextureAsset(asset as SharedTextureAssetDefinition);
        default:
            return false;
    }
}

function _onJobPromiseFinished(hash: SharedAssetId) {
    console.log("Conversion Job finished", hash);
    conversionJobs.delete(hash);
    _setState(hash, SharedConversionState.FinishedJob);
}

function _updateStaleStates(assets: MapIterator<SharedAsset>): boolean {
    let updated = false;
    for (let asset of assets) {
        if (_updateStaleState(asset.def)) {
            updated = true;
        }
    }
    return updated;
}

function _updateStaleState(asset: SharedAssetDefinition): boolean {
    const state = conversions.get(asset.id)?.state ?? SharedConversionState.Unknown;
    if (state === SharedConversionState.PendingForced) {
        return false;
    }

    const isConverted = _isConverted(asset);

    if (!isConverted && state === SharedConversionState.Unknown) {
        conversions.set(asset.id, { hash: asset.id, state: SharedConversionState.Pending });
        return true;
    }

    if (isConverted && state !== SharedConversionState.FinishedConfirmed) {
        _setState(asset.id, SharedConversionState.FinishedConfirmed);
        return true;
    }

    return false;
}

export function _isConverted(asset: SharedAssetDefinition): boolean {
    switch (asset.type) {
        case SharedAssetType.Texture: {
            return _isTextureConverted(asset as SharedTextureAssetDefinition);
        }
        // There's no way to convert an invalid asset so we just say it is converted
        case SharedAssetType.Unknown:
        default:
            return true;
    }
}

export function _isTextureConverted(asset: SharedTextureAssetDefinition): boolean {
    return asset.gameFiles !== undefined && asset.gameFiles.length > 0;
}

function _setState(hash: SharedAssetId, state: SharedConversionState) {
    if (conversions.has(hash)) {
        conversions.get(hash)!.state = state;
    } else {
        conversions.set(hash, { hash, state });
    }
}
