import { getAssetFromId } from "./assets/MainAssetRepository.js";
import {
    SharedAssetDefinition,
    SharedAssetId,
    SharedAssetMap,
    SharedAssetTypes,
    SharedModelAssetDefinition,
    SharedTextureAssetDefinition,
} from "Shared/SharedAssetDefinition.js";
import { SharedConversion, SharedConversionState } from "Shared/SharedConversion.js";
import { notifyConversionsUpdated } from "../api/MainConversionApi.js";
import { TextureConverter } from "./converter/MainTextureConverter.js";
import { ModelConverter } from "./converter/MainModelConverter.js";
import fs from "fs/promises";
import { existsSync } from "fs";
import { subscribeAssetsRescanned } from "../api/MainAssetApi.js";
import { makeContentPathAbsolute, makeGamePathAbsolute } from "../helpers/MainSourceFs.js";
import { ConversionChecksumSystem } from "./MainConversionChecksumSystem.js";
import { ConversionEventSystem } from "./MainConversionEventSystem.js";
import { HotReloadSystem } from "./MainHotReloadSystem.js";
import { AssetWatcherSystem } from "./MainAssetWatcherSystem.js";

const MAX_PARALLEL_JOBS = 1;
const CONVERSION_INTERVAL_MS = 100;

type JobResult = string | undefined;
const conversionJobs: Map<SharedAssetId, Promise<JobResult>> = new Map<SharedAssetId, Promise<JobResult>>();

let agentInterval: NodeJS.Timeout | undefined;
const conversionsMap: Map<SharedAssetId, SharedConversion> = new Map<SharedAssetId, SharedConversion>();

export const ConversionAgentSystem = {
    initSystem(): boolean {
        subscribeAssetsRescanned((event) => {
            _initStates(event.assets);
        });
        return true;
    },
    startAgent(): void {
        if (!agentInterval) {
            agentInterval = setInterval(_runAgent, CONVERSION_INTERVAL_MS);
        }
    },
    stopAgent(): void {
        if (agentInterval) {
            clearInterval(agentInterval);
        }
    },
    getConversionsMap(): Map<string, SharedConversion> {
        return conversionsMap;
    },
    enqueue(assetId: string, force: boolean = false): void {
        if (_getState(assetId) === SharedConversionState.InProgress) {
            return;
        }

        if (force) {
            _setState(assetId, SharedConversionState.PendingForced, true);
        } else {
            _setState(assetId, SharedConversionState.Pending, true);
        }
    },
};

async function _initStates(map: SharedAssetMap) {
    for (const asset of map.values()) {
        if (!_isValidAsset(asset.def) || !_doContentFilesExist(asset.def)) {
            _setState(asset.def.id, SharedConversionState.Invalid);
            continue;
        }

        const stale = await _isAssetStale(asset.def);
        if (stale) {
            ConversionAgentSystem.enqueue(asset.def.id);
        } else {
            _setState(asset.def.id, SharedConversionState.NoChange);
        }
    }
}

async function _runAgent(): Promise<void> {
    const assetsToConvert = _getAssetsToConvert();
    if (assetsToConvert.length > 0) {
        await _startConversions(assetsToConvert);
    }

    notifyConversionsUpdated({
        conversions: conversionsMap,
        events: ConversionEventSystem.conversionEvents,
        summary: {
            currentStatus: conversionJobs.size === 0 ? "idle" : "working",
            totalSum: ConversionEventSystem.conversionEvents.length,
        },
    });
}

function _getAssetsToConvert(): SharedAssetId[] {
    let freeJobsCount = MAX_PARALLEL_JOBS - conversionJobs.size;
    if (freeJobsCount === 0) return [];

    const result: SharedAssetId[] = [];

    for (const conv of conversionsMap.values()) {
        if (freeJobsCount <= 0) break;

        const alreadyAdded = conversionJobs.has(conv.assetId);
        const isPending =
            conv.state === SharedConversionState.Pending || conv.state === SharedConversionState.PendingForced;
        if (isPending && !alreadyAdded) {
            result.push(conv.assetId);
            freeJobsCount--;
        }
    }

    return result;
}

async function _startConversion(id: SharedAssetId): Promise<string | undefined> {
    const asset = getAssetFromId(id);
    const previousState = _getState(id);
    if (!asset) {
        _setState(id, SharedConversionState.Unknown);
        return undefined;
    }
    const startTime = new Date();
    ConversionEventSystem.pushNewEvent(asset.def.id, startTime, previousState);
    _setState(id, SharedConversionState.InProgress);

    console.trace(asset);

    if (!_isValidAsset(asset.def) || !_doContentFilesExist(asset.def)) {
        _setState(id, SharedConversionState.Invalid);
        return undefined;
    }

    const force = previousState === SharedConversionState.PendingForced;

    if (!force) {
        const hasChanged = await ConversionChecksumSystem.hasChanged(asset.def);
        if (!hasChanged) {
            const isStale = await _isAssetStale(asset.def);
            if (!isStale) {
                _setState(id, SharedConversionState.NoChange);
                return undefined;
            }
        }
    }

    console.log("Converting asset", asset.def.displayName, asset.def.id);
    const timeoutPromise = _convertAsset(asset.def);
    timeoutPromise.catch((a) => {
        _onJobPromiseDone(id, SharedConversionState.Failed, a);
    });
    timeoutPromise.then((log) => {
        const newState = log === undefined ? SharedConversionState.Failed : SharedConversionState.Finished;
        _onJobPromiseDone(id, newState, log);
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

    return Promise.allSettled(promises).then((_) => {
        HotReloadSystem.requestHotReload(ids);
    });
}

async function _convertAsset(asset: SharedAssetDefinition): Promise<string | undefined> {
    switch (asset.type) {
        case SharedAssetTypes.Texture:
            return TextureConverter.convert(asset as SharedTextureAssetDefinition);
        case SharedAssetTypes.Model:
            return ModelConverter.convert(asset as SharedModelAssetDefinition);
        default:
            return undefined;
    }
}

function _isValidAsset(asset: SharedAssetDefinition): boolean {
    switch (asset.type) {
        case SharedAssetTypes.Texture:
            return TextureConverter.isValid(asset as SharedTextureAssetDefinition);
        case SharedAssetTypes.Model:
            return ModelConverter.getQcFile(asset as SharedModelAssetDefinition) !== undefined;
        default:
            return false;
    }
}

function _doContentFilesExist(asset: SharedAssetDefinition): boolean {
    if (asset.contentFiles === undefined) return false;
    return !asset.contentFiles.map((c) => existsSync(makeContentPathAbsolute(c))).some((c) => !c);
}

function _onJobPromiseDone(id: SharedAssetId, stateAfter: SharedConversionState, log: string | undefined) {
    conversionJobs.delete(id);
    _setState(id, stateAfter);
    ConversionEventSystem.updateLatestEvent(id, (event) => {
        event.endTime = new Date();
        if (log) {
            event.log += log;
        }
    });
}

function _setState(id: SharedAssetId, state: SharedConversionState, noHistory = false) {
    if (conversionsMap.has(id)) {
        conversionsMap.get(id)!.state = state;
    } else {
        conversionsMap.set(id, { assetId: id, state });
    }

    if (!noHistory) {
        ConversionEventSystem.updateLatestEvent(id, (event) => {
            event.stateHistory.push(state);
        });
    }
}

function _getState(id: SharedAssetId) {
    return conversionsMap.get(id)?.state ?? SharedConversionState.Unknown;
}

async function _touchAsset(asset: SharedAssetDefinition) {
    if (asset.contentFiles === undefined || asset.contentFiles.length === 0) return false;
    if (asset.gameFiles === undefined || asset.gameFiles.length === 0) return false;

    const time = Math.floor(new Date().getTime() / 1000);
    for (const contentFile of asset.contentFiles) {
        const p = makeContentPathAbsolute(contentFile);

        AssetWatcherSystem.ignore(p);
        await fs.utimes(p, time, time);
    }

    for (const gameFile of asset.gameFiles) {
        const p = makeGamePathAbsolute(gameFile);

        AssetWatcherSystem.ignore(p);
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
