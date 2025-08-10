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
import { _convertTextureAsset, determineTextureAssetState } from "./converter/MainTextureConverter.js";
import { requestHotReload } from "./MainHotReloadSystem.js";

const MAX_PARALLEL_JOBS = 1;

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

export function getConversionState(): Map<string, SharedConversion> {
    return conversions;
}

export function enqueueConversion(assetId: string): void {
    console.log(`Enqueuing ${assetId} for forced conversion`);
    _setState(assetId, SharedConversionState.PendingForced);
}

async function _runAgent(): Promise<void> {
    const assetsIter = getAssetMap().values();
    let updated = await _updateStaleStates(assetsIter);
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
        timeoutPromise.catch((a) => console.warn("Conversion failed", a));
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

async function _updateStaleStates(assets: MapIterator<SharedAsset>): Promise<boolean> {
    let updated = false;
    for (let asset of assets) {
        if (await _updateStaleState(asset.def)) {
            updated = true;
        }
    }
    return updated;
}

async function _updateStaleState(asset: SharedAssetDefinition): Promise<boolean> {
    const convState = conversions.get(asset.id)?.state ?? SharedConversionState.Unknown;
    if (convState === SharedConversionState.PendingForced) {
        return false;
    }

    const assetState = await determineAssetState(asset);

    if (assetState === AssetStates.Invalid) {
        _setState(asset.id, SharedConversionState.Invalid);
        return true;
    }

    if (assetState === AssetStates.NoOutputFiles && convState === SharedConversionState.Unknown) {
        conversions.set(asset.id, { hash: asset.id, state: SharedConversionState.Pending });
        return true;
    }

    if (assetState == AssetStates.HasOutputFiles && convState !== SharedConversionState.FinishedConfirmed) {
        _setState(asset.id, SharedConversionState.FinishedConfirmed);
        return true;
    }

    return false;
}

export const AssetStates = {
    Invalid: "invalid",
    HasOutputFiles: "has_output_files",
    NoOutputFiles: "no_output_files",
} as const;
export type AssetState = (typeof AssetStates)[keyof typeof AssetStates];
export async function determineAssetState(asset: SharedAssetDefinition): Promise<AssetState> {
    switch (asset.type) {
        case SharedAssetType.Texture:
            return determineTextureAssetState(asset as SharedTextureAssetDefinition);
        default:
            return AssetStates.Invalid;
    }
}

function _setState(id: SharedAssetId, state: SharedConversionState) {
    if (conversions.has(id)) {
        conversions.get(id)!.state = state;
    } else {
        conversions.set(id, { hash: id, state });
    }
}
