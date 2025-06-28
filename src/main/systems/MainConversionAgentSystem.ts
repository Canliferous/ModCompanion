import { getAssetFromHash, getAssetMap } from "./assets/MainAssetRepository.js";
import { SharedAsset, SharedAssetHash, SharedAssetType, SharedTextureAsset } from "Shared/SharedAsset.js";
import { SharedConversion, SharedConversionState } from "Shared/SharedConversion.js";
import { notifyConversionsUpdated } from "../api/MainConversionApi.js";
import _ from "lodash";
import { _convertTextureAsset } from "./converter/MainTextureConverter.js";

const MAX_PARALLEL_JOBS = 5;

type JobResult = boolean;
const conversionJobs: Map<SharedAssetHash, Promise<JobResult>> = new Map<SharedAssetHash, Promise<JobResult>>();

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

function _getAssetsToConvert(): SharedAssetHash[] {
    let newJobsCount = MAX_PARALLEL_JOBS - conversionJobs.size;
    if (newJobsCount === 0) return [];

    const result: SharedAssetHash[] = [];

    for (const conv of conversions.values()) {
        if (newJobsCount === 0) break;

        const alreadyAdded = conversionJobs.has(conv.hash);
        if (conv.state === SharedConversionState.Pending && !alreadyAdded) {
            result.push(conv.hash);
            newJobsCount--;
        }
    }

    return result;
}

function _startConversions(hashes: SharedAssetHash[]): void {
    for (const hash of hashes) {
        const asset = getAssetFromHash(hash);
        if (!asset) {
            _setState(hash, SharedConversionState.Unknown);
            continue;
        }
        _setState(hash, SharedConversionState.InProgress);

        const timeoutPromise = _convertAsset(asset);

        timeoutPromise.finally(() => _onJobPromiseFinished(hash));
        conversionJobs.set(hash, timeoutPromise);
    }
}

async function _convertAsset(asset: SharedAsset): Promise<boolean> {
    switch (asset.type) {
        case SharedAssetType.Texture:
            return _convertTextureAsset(asset as SharedTextureAsset);
        default:
            return false;
    }
}

function _onJobPromiseFinished(hash: SharedAssetHash) {
    conversionJobs.delete(hash);
    _setState(hash, SharedConversionState.FinishedJob);
}

function _updateStaleStates(assets: MapIterator<SharedAsset>): boolean {
    let updated = false;
    for (let asset of assets) {
        if (_updateStaleState(asset)) {
            updated = true;
        }
    }
    return updated;
}

function _updateStaleState(asset: SharedAsset): boolean {
    const state = conversions.get(asset.hash)?.state ?? SharedConversionState.Unknown;
    const isConverted = _isConverted(asset);

    if (!isConverted && state === SharedConversionState.Unknown) {
        conversions.set(asset.hash, { hash: asset.hash, state: SharedConversionState.Pending });
        return true;
    }

    if (isConverted && state !== SharedConversionState.FinishedConfirmed) {
        _setState(asset.hash, SharedConversionState.FinishedConfirmed);
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

function _setState(hash: SharedAssetHash, state: SharedConversionState) {
    if (conversions.has(hash)) {
        conversions.get(hash)!.state = state;
    } else {
        conversions.set(hash, { hash, state });
    }
}
