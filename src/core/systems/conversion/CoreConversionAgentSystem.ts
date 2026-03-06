import fs from "fs/promises";
import { existsSync } from "fs";
import { getAssetFromId, getAssetMap } from "../asset/CoreAssetRepository.js";
import { TextureConverter } from "../../helpers/converter/CoreTextureConverter.js";
import { ModelConverter } from "../../helpers/converter/CoreModelConverter.js";
import { makeContentPathAbsolute, makeGamePathAbsolute } from "../../helpers/CoreSourceFs.js";
import { ConversionChecksumSystem } from "./CoreConversionChecksumSystem.js";
import { ConversionEventSystem } from "./CoreConversionEventSystem.js";
import { HotReloadSystem } from "../CoreHotReloadSystem.js";
import { AssetWatcherSystem } from "../CoreAssetWatcherSystem.js";
import { Logger } from "../CoreLogSystem.js";
import * as Shared from "mod_companion_shared";

const MAX_PARALLEL_JOBS = 1;
const CONVERSION_INTERVAL_MS = 100;

let lastChangeTime: Date | undefined = undefined;

type JobResult = string | undefined;
const conversionJobs: Map<Shared.Asset.AssetId, Promise<JobResult>> = new Map();

let agentInterval: NodeJS.Timeout | undefined;
const conversionsMap: Map<Shared.Asset.AssetId, Shared.Conversion.SharedConversion> = new Map();

export const ConversionAgentSystem = {
    initSystem(): boolean {
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
    async runAndConvertUntilItIsDone(): Promise<void> {
        for (const conv of conversionsMap.values()) {
            if (conv.state === Shared.Conversion.State.Pending) {
                await _startConversion(conv.assetId);
            }
        }
    },
    getConversionsMap(): Map<string, Shared.Conversion.SharedConversion> {
        return conversionsMap;
    },
    enqueue(assetId: string, force: boolean = false): void {
        if (_getState(assetId) === Shared.Conversion.State.InProgress) {
            return;
        }

        if (force) {
            _setState(assetId, Shared.Conversion.State.PendingForced, true);
        } else {
            _setState(assetId, Shared.Conversion.State.Pending, true);
        }
    },
    enqueueAll(): void {
        for (const assetId of getAssetMap().keys()) {
            ConversionAgentSystem.enqueue(assetId, true);
        }
    },
    async initStates(map: Shared.Asset.SharedAssetMap) {
        for (const asset of map.values()) {
            if (!_isValidAsset(asset.def) || !_doContentFilesExist(asset.def)) {
                _setState(asset.def.id, Shared.Conversion.State.Invalid);
                continue;
            }

            const stale = await _isAssetStale(asset.def);
            if (stale) {
                ConversionAgentSystem.enqueue(asset.def.id);
            } else {
                _setState(asset.def.id, Shared.Conversion.State.NoChange);
            }
        }
    },
};

async function _runAgent(): Promise<void> {
    const assetsToConvert = _getAssetsToConvert();
    if (assetsToConvert.length > 0) {
        // Logger.info(SharedLogChannel.ConversionAgent, `Converting ${assetsToConvert.length} asset`);
        const promises: Promise<string | undefined>[] = [];
        for (const id of assetsToConvert) {
            promises.push(_startConversion(id));
        }

        return Promise.allSettled(promises).then(() => {
            HotReloadSystem.requestHotReload(assetsToConvert);
        });
    }

    // todo
    // notifyConversionsUpdated({
    //     conversions: conversionsMap,
    //     conversionsLastChangeTime: lastChangeTime,
    //     events: ConversionEventSystem.conversionEvents,
    //     eventsLastChangeTime: ConversionEventSystem.lastChangeTime,
    //     summary: {
    //         currentStatus: conversionJobs.size === 0 ? "idle" : "working",
    //         totalSum: ConversionEventSystem.conversionEvents.length,
    //     },
    // });
}

function _getAssetsToConvert(): Shared.Asset.AssetId[] {
    let freeJobsCount = MAX_PARALLEL_JOBS - conversionJobs.size;
    if (freeJobsCount === 0) return [];

    const result: Shared.Asset.AssetId[] = [];

    for (const conv of conversionsMap.values()) {
        if (freeJobsCount <= 0) break;

        const alreadyAdded = conversionJobs.has(conv.assetId);
        const isPending =
            conv.state === Shared.Conversion.State.Pending || conv.state === Shared.Conversion.State.PendingForced;
        if (isPending && !alreadyAdded) {
            result.push(conv.assetId);
            freeJobsCount--;
        }
    }

    return result;
}

async function _startConversion(id: Shared.Asset.AssetId): Promise<string | undefined> {
    const asset = getAssetFromId(id);
    const previousState = _getState(id);
    if (!asset) {
        _setState(id, Shared.Conversion.State.Unknown);
        return undefined;
    }
    const startTime = new Date();
    ConversionEventSystem.pushNewEvent(asset.def.id, startTime, previousState);
    _setState(id, Shared.Conversion.State.InProgress);

    if (!_isValidAsset(asset.def) || !_doContentFilesExist(asset.def)) {
        _setState(id, Shared.Conversion.State.Invalid);
        return undefined;
    }

    const force = previousState === Shared.Conversion.State.PendingForced;

    if (!force) {
        const hasChanged = await ConversionChecksumSystem.hasChanged(asset.def);
        if (!hasChanged) {
            const isStale = await _isAssetStale(asset.def);
            if (!isStale) {
                _setState(id, Shared.Conversion.State.NoChange);
                return undefined;
            }
        }
    }

    Logger.info(Shared.Log.Channel.ConversionAgent, "Converting asset", asset.def.displayName, asset.def.id);
    const timeoutPromise = _convertAsset(asset.def);
    timeoutPromise.catch((log: string | undefined) => {
        Logger.info(Shared.Log.Channel.ConversionAgent, log);
        _onJobPromiseDone(id, Shared.Conversion.State.Failed, log);
    });
    timeoutPromise.then((log) => {
        const newState = log === undefined ? Shared.Conversion.State.Failed : Shared.Conversion.State.Finished;
        _onJobPromiseDone(id, newState, log);
        _touchAsset(asset.def);
    });
    conversionJobs.set(id, timeoutPromise);
    return timeoutPromise;
}

async function _convertAsset(asset: Shared.Asset.SharedAssetDefinition): Promise<string | undefined> {
    switch (asset.type) {
        case Shared.Asset.Types.Texture:
            return TextureConverter.convert(asset as Shared.Asset.SharedTextureAssetDefinition);
        case Shared.Asset.Types.Model:
            return ModelConverter.convert(asset as Shared.Asset.SharedModelAssetDefinition);
        default:
            return undefined;
    }
}

function _isValidAsset(asset: Shared.Asset.SharedAssetDefinition): boolean {
    switch (asset.type) {
        case Shared.Asset.Types.Texture:
            return TextureConverter.isValid(asset as Shared.Asset.SharedTextureAssetDefinition);
        case Shared.Asset.Types.Model:
            return ModelConverter.getQcFile(asset as Shared.Asset.SharedModelAssetDefinition) !== undefined;
        default:
            return false;
    }
}

function _doContentFilesExist(asset: Shared.Asset.SharedAssetDefinition): boolean {
    if (asset.contentFiles === undefined) return false;
    return !asset.contentFiles.map((c) => existsSync(makeContentPathAbsolute(c))).some((c) => !c);
}

function _onJobPromiseDone(id: Shared.Asset.AssetId, stateAfter: Shared.Conversion.State, log: string | undefined) {
    conversionJobs.delete(id);
    _setState(id, stateAfter);
    ConversionEventSystem.updateLatestEvent(id, (event) => {
        event.endTime = new Date();
        if (log) {
            event.log += log;
        }
    });
}

function _setState(id: Shared.Asset.AssetId, state: Shared.Conversion.State, noHistory = false) {
    if (conversionsMap.has(id)) {
        conversionsMap.get(id)!.state = state;
    } else {
        conversionsMap.set(id, { assetId: id, state });
        lastChangeTime = new Date();
    }

    if (!noHistory) {
        ConversionEventSystem.updateLatestEvent(id, (event) => {
            event.stateHistory.push(state);
        });
    }
}

function _getState(id: Shared.Asset.AssetId) {
    return conversionsMap.get(id)?.state ?? Shared.Conversion.State.Unknown;
}

async function _touchAsset(asset: Shared.Asset.SharedAssetDefinition) {
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

async function _isAssetStale(asset: Shared.Asset.SharedAssetDefinition): Promise<boolean> {
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
    } catch {
        // We don't care about the error. If stat fails it probably doesn't exist which is an expected state
        return undefined;
    }
}
