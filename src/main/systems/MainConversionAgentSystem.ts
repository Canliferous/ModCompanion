import { getAssetFromId } from "./assets/MainAssetRepository.js";
import {
    SharedAssetDefinition,
    SharedAssetId,
    SharedAssetMap,
    SharedAssetTypes,
    SharedModelAssetDefinition,
    SharedTextureAssetDefinition,
} from "Shared/SharedAssetDefinition.js";
import { SharedConversion, SharedConversionHistoryItem, SharedConversionState } from "Shared/SharedConversion.js";
import { notifyConversionSummary, notifyConversionsUpdated } from "../api/MainConversionApi.js";
import { convertTextureAsset } from "./converter/MainTextureConverter.js";
import { requestHotReload } from "./MainHotReloadSystem.js";
import { convertModelAsset } from "./converter/MainModelConverter.js";
import path from "path";
import fs from "fs/promises";
import crypto from "node:crypto";
import { getAppConfig } from "./MainConfigSystem.js";
import { subscribeAssetsRescanned } from "../api/MainAssetApi.js";
import { makeContentPathAbsolute, makeGamePathAbsolute } from "../helpers/MainSourceFs.js";

const MAX_PARALLEL_JOBS = 1;

type JobResult = string | undefined;
const conversionJobs: Map<SharedAssetId, Promise<JobResult>> = new Map<SharedAssetId, Promise<JobResult>>();

let agentInterval: NodeJS.Timeout | undefined;
const conversionsMap: Map<SharedAssetId, SharedConversion> = new Map<SharedAssetId, SharedConversion>();
const conversionHistory: SharedConversionHistoryItem[] = [];
const assetChecksums: Map<SharedAssetId, string> = new Map<SharedAssetId, string>();

export function initConvertAgentSystem(): boolean {
    subscribeAssetsRescanned((event) => {
        _initializeAssetChecksums(event.assets);
        _initializeAssetStates(event.assets);
    });
    return true;
}

async function _initializeAssetChecksums(map: SharedAssetMap) {
    const startTime = new Date();
    {
        const assets = map.values();
        const promises = assets.map(async (asset) => {
            if (!asset.def.contentFiles) return;

            const sum = await _createAssetChecksum(asset.def.contentFiles);
            assetChecksums.set(asset.def.id, sum);
        });

        await Promise.allSettled(promises);
    }
    const endTime = new Date();
    console.log(`Initialized asset checksums in ${endTime.getTime() - startTime.getTime()}ms`);
}

async function _initializeAssetStates(map: SharedAssetMap) {
    for (const asset of map.values()) {
        const stale = await _isAssetStale(asset.def);
        if (stale) {
            enqueueConversion(asset.def.id);
        } else {
            _setState(asset.def.id, SharedConversionState.NoChange);
        }
    }
}

export function startConversionAgent(): void {
    if (!agentInterval) {
        agentInterval = setInterval(_runAgent, 50);
    }
}

export function stopConversionAgent(): void {
    if (agentInterval) {
        clearInterval(agentInterval);
    }
}

export function getConversionState(): Map<string, SharedConversion> {
    return conversionsMap;
}

export function enqueueConversion(assetId: string, force: boolean = false): void {
    if (force) {
        _setState(assetId, SharedConversionState.PendingForced);
    } else {
        _setState(assetId, SharedConversionState.Pending);
    }
}

async function _runAgent(): Promise<void> {
    const assetsToConvert = _getAssetsToConvert();
    if (assetsToConvert.length > 0) {
        await _startConversions(assetsToConvert);
    }

    notifyConversionsUpdated({ conversions: conversionsMap, history: conversionHistory });
    notifyConversionSummary({
        currentStatus: conversionJobs.size === 0 ? "idle" : "working",
        totalSum: conversionHistory.length,
    });
}

function _getAssetsToConvert(): SharedAssetId[] {
    let newJobsCount = MAX_PARALLEL_JOBS - conversionJobs.size;
    if (newJobsCount === 0) return [];

    const result: SharedAssetId[] = [];

    for (const conv of conversionsMap.values()) {
        if (newJobsCount === 0) break;

        const alreadyAdded = conversionJobs.has(conv.assetId);
        const isPending =
            conv.state === SharedConversionState.Pending || conv.state === SharedConversionState.PendingForced;
        if (isPending && !alreadyAdded) {
            result.push(conv.assetId);
            newJobsCount--;
        }
    }

    return result;
}

async function _startConversion(id: SharedAssetId): Promise<string | undefined> {
    const asset = getAssetFromId(id);
    const stateBefore = conversionsMap.get(id)?.state ?? SharedConversionState.Unknown;
    if (!asset) {
        _setState(id, SharedConversionState.Unknown);
        return undefined;
    }
    _setState(id, SharedConversionState.InProgress);

    const force = stateBefore === SharedConversionState.PendingForced;

    if (!force) {
        const hasChanged = await _hasAssetChanged(asset.def);
        if (!hasChanged) {
            const isStale = await _isAssetStale(asset.def);
            if (!isStale) {
                console.log("Has not changed and is not stale");
                _setState(id, SharedConversionState.NoChange);
                return undefined;
            }
        }
    }

    console.log("Converting asset", asset.def.displayName, asset.def.id);
    const startTime = new Date();
    const timeoutPromise = _convertAsset(asset.def);
    timeoutPromise.catch((a) => {
        _onJobPromiseDone(id, startTime, stateBefore, SharedConversionState.Failed, a);
    });
    timeoutPromise.then((log) => {
        const newState = log === undefined ? SharedConversionState.Failed : SharedConversionState.Finished;
        _onJobPromiseDone(id, startTime, stateBefore, newState, log ?? "");
        _touchAsset(asset.def);
    });
    conversionJobs.set(id, timeoutPromise);
    return timeoutPromise;
}

async function _startConversions(ids: SharedAssetId[]): Promise<void> {
    const promises: Promise<string | undefined>[] = [];
    for (const id of ids) {
        promises.push(_startConversion(id));
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

function _setState(id: SharedAssetId, state: SharedConversionState) {
    if (conversionsMap.has(id)) {
        conversionsMap.get(id)!.state = state;
    } else {
        conversionsMap.set(id, { assetId: id, state });
    }
}

async function _touchAsset(asset: SharedAssetDefinition) {
    if (asset.contentFiles === undefined || asset.contentFiles.length === 0) return false;
    if (asset.gameFiles === undefined || asset.gameFiles.length === 0) return false;

    const time = Math.floor(new Date().getTime() / 1000);
    for (const contentFile of asset.contentFiles) {
        const p = makeContentPathAbsolute(contentFile);
        await fs.utimes(p, time, time);
    }

    for (const gameFile of asset.gameFiles) {
        const p = makeGamePathAbsolute(gameFile);
        await fs.utimes(p, time, time);
    }
}

async function _isAssetStale(asset: SharedAssetDefinition): Promise<boolean> {
    if (asset.contentFiles === undefined || asset.contentFiles.length === 0) return false;
    if (asset.gameFiles === undefined || asset.gameFiles.length === 0) return false;

    const contentTimePromises = asset.contentFiles.map(makeContentPathAbsolute).map(_getModifiedTime);
    const gameTimePromises = asset.gameFiles.map(makeGamePathAbsolute).map(_getModifiedTime);

    const contentTimes = await Promise.all(contentTimePromises);
    const gameTimes = await Promise.all(gameTimePromises);

    const allTimes = [...contentTimes, ...gameTimes];
    const timesSet = new Set(allTimes);

    const isStale = timesSet.size !== 1;
    return isStale;
}

async function _getModifiedTime(filePath: string): Promise<number | undefined> {
    try {
        const stat = await fs.stat(filePath);
        return stat.mtimeMs;
    } catch (e) {
        // We don't care about the error. If stat fails it probably doesn't exist which is an expected state
        return undefined;
    }
}

async function _hasAssetChanged(asset: SharedAssetDefinition): Promise<boolean> {
    if (asset.contentFiles === undefined || asset.contentFiles.length === 0) return false;

    const newSum = await _createAssetChecksum(asset.contentFiles);
    const oldSum = assetChecksums.get(asset.id);

    if (newSum !== oldSum) {
        assetChecksums.set(asset.id, newSum);
        return true;
    } else {
        return false;
    }
}

async function _createAssetChecksum(contentFiles: string[]) {
    const contentPath = getAppConfig().contentPath;

    const promises = contentFiles.map(async (f) => {
        const p = path.join(contentPath, f);
        const fileContents = await fs.readFile(p, "base64");
        const hash = crypto.createHash("sha1").update(fileContents).digest("base64");
        return hash;
    });

    const results = await Promise.all(promises);
    const sum = results.join();
    return sum;
}
