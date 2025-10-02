import { getAssetFromId, getAssetMap } from "./assets/MainAssetRepository.js";
import {
    SharedAsset,
    SharedAssetDefinition,
    SharedAssetId,
    SharedAssetTypes,
    SharedModelAssetDefinition,
    SharedTextureAssetDefinition,
} from "Shared/SharedAssetDefinition.js";
import { SharedConversion, SharedConversionHistoryItem, SharedConversionState } from "Shared/SharedConversion.js";
import { notifyConversionsUpdated } from "../api/MainConversionApi.js";
import { convertTextureAsset, determineTextureAssetState } from "./converter/MainTextureConverter.js";
import { requestHotReload } from "./MainHotReloadSystem.js";
import { convertModelAsset, determineModelAssetState } from "./converter/MainModelConverter.js";

const MAX_PARALLEL_JOBS = 1;

type JobResult = string | undefined;
const conversionJobs: Map<SharedAssetId, Promise<JobResult>> = new Map<SharedAssetId, Promise<JobResult>>();

let agentInterval: NodeJS.Timeout | undefined;
const conversions: Map<SharedAssetId, SharedConversion> = new Map<SharedAssetId, SharedConversion>();
const conversionHistory: SharedConversionHistoryItem[] = [];

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
        await _startConversions(assetsToConvert);
    }

    if (updated) {
        notifyConversionsUpdated({ conversions, history: conversionHistory });
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

function _startConversions(ids: SharedAssetId[]): Promise<void> {
    const promises: Promise<string | undefined>[] = [];
    for (const id of ids) {
        const asset = getAssetFromId(id);
        const stateBefore = conversions.get(id)?.state ?? SharedConversionState.Unknown;
        if (!asset) {
            _setState(id, SharedConversionState.Unknown);
            continue;
        }
        _setState(id, SharedConversionState.InProgress);

        const startTime = new Date();
        const timeoutPromise = _convertAsset(asset.def);
        promises.push(timeoutPromise);
        timeoutPromise.catch((a) => {
            _onJobPromiseDone(id, startTime, stateBefore, SharedConversionState.Failed, a);
        });
        timeoutPromise.then((log) => {
            const newState = log === undefined ? SharedConversionState.Failed : SharedConversionState.Finished;
            _onJobPromiseDone(id, startTime, stateBefore, newState, log ?? "");
        });
        conversionJobs.set(id, timeoutPromise);
    }

    return Promise.allSettled(promises).then((p) => {
        requestHotReload(ids);
    });
}

async function _convertAsset(asset: SharedAssetDefinition): Promise<string | undefined> {
    switch (asset.type) {
        case SharedAssetTypes.Texture:
            return convertTextureAsset(asset as SharedTextureAssetDefinition);
        case SharedAssetTypes.Model:
            return convertModelAsset(asset as SharedModelAssetDefinition);
        default:
            return undefined;
    }
}

function _onJobPromiseDone(
    id: SharedAssetId,
    startTime: Date,
    stateBefore: SharedConversionState,
    stateAfter: SharedConversionState,
    log: string,
) {
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();

    console.log(`Conversion Job completed as ${stateAfter} ${id} took ${durationMs}ms`);
    conversionJobs.delete(id);
    _setState(id, stateAfter);

    conversionHistory.push({
        assetId: id,
        stateAfter,
        startTime,
        endTime,
        stateBefore,
        log,
    });
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

    if (assetState === AssetStates.Invalid && convState !== SharedConversionState.Invalid) {
        _setState(asset.id, SharedConversionState.Invalid);
        return true;
    }

    if (assetState === AssetStates.NoOutputFiles) {
        if (convState === SharedConversionState.Unknown) {
            conversions.set(asset.id, { hash: asset.id, state: SharedConversionState.Pending });
            return true;
        }
    }

    if (assetState == AssetStates.HasOutputFiles && convState !== SharedConversionState.Finished) {
        _setState(asset.id, SharedConversionState.Finished);
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
        case SharedAssetTypes.Texture:
            return determineTextureAssetState(asset as SharedTextureAssetDefinition);
        case SharedAssetTypes.Model:
            return determineModelAssetState(asset as SharedModelAssetDefinition);
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
