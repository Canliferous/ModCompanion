import { notifyCompileLog, notifyCompileProgress, notifyQueueUpdated } from "../api/MainMapCompileApi.js";
import { MapCompilerAction, runVBsp, runVRad, runVVis } from "../launcher/MainMapCompilerLaunchers.js";
import { SharedMapCompileLogEventType } from "../../shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileState, SharedMapCompileStep } from "../../shared/SharedMapCompile.js";

interface MapCompileStepStage {
    step: SharedMapCompileStep;
    state: SharedMapCompileState;
    action: MapCompilerAction;
}

const mapQueue: string[] = [];
let workerInterval: NodeJS.Timeout | undefined = undefined;
const mapQueueStages = new Map<string, MapCompileStepStage[]>();
let currentCompilePromise: Promise<boolean> | undefined = undefined;

export function initMapCompileSystem(): boolean {
    workerInterval = setInterval(_workQueue, 200);

    return true;
}

export function enqueueMap(mapPath: string) {
    if (mapQueue.includes(mapPath)) {
        console.warn(`Map ${mapPath} is already in queue`);
        return;
    }

    mapQueue.push(mapPath);
    mapQueueStages.set(mapPath, _createStages());
    notifyQueueUpdated();
}

export function getMapQueue(): string[] {
    return mapQueue;
}

function _createStages(): MapCompileStepStage[] {
    return [
        {
            state: SharedMapCompileState.Idle,
            step: SharedMapCompileStep.VBsp,
            action: runVBsp,
        },
        {
            state: SharedMapCompileState.Idle,
            step: SharedMapCompileStep.VVis,
            action: runVVis,
        },
        {
            state: SharedMapCompileState.Idle,
            step: SharedMapCompileStep.VRad,
            action: runVRad,
        },
    ];
}

function _workQueue() {
    if (mapQueue.length === 0) return;

    const item = _getQueueWorkItem();
    if (!item) return;

    _workMap(item.mapPath, item.steps);
}

function _isStepsCompleted(steps: MapCompileStepStage[]): boolean {
    return !steps.some((s) => s.state !== SharedMapCompileState.Completed);
}

function _getQueueWorkItem(): { mapPath: string; steps: MapCompileStepStage[] } | undefined {
    for (let i = 0; i < mapQueue.length; i++) {
        let steps = mapQueueStages.get(mapQueue[i]);
        if (steps === undefined) {
            continue;
        }

        if (!_isStepsCompleted(steps)) {
            return { mapPath: mapQueue[i], steps };
        }
    }

    return undefined;
}

function _workMap(mapPath: string, steps: MapCompileStepStage[]) {
    const inProgressStepIdx = steps.findIndex((s) => s.state === SharedMapCompileState.InProgress);
    if (inProgressStepIdx > 0 || currentCompilePromise !== undefined) {
        return;
    }

    for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        if (step.state === SharedMapCompileState.Idle) {
            _startStage(mapPath, i);
            return;
        }
    }
}

function _startStage(mapPath: string, stageIdx: number) {
    const stage = mapQueueStages.get(mapPath)![stageIdx];
    console.log("Starting stage", stage);

    notifyCompileLog({ type: SharedMapCompileLogEventType.Clear, mapPath });
    currentCompilePromise = stage.action(
        mapPath,
        (msg: string) => {
            notifyCompileLog({ type: SharedMapCompileLogEventType.AppendMessage, mapPath, message: msg });
        },
        (msg: string) => {
            notifyCompileLog({ type: SharedMapCompileLogEventType.AppendError, mapPath, message: msg });
        },
    );
    stage.state = SharedMapCompileState.InProgress;
    notifyCompileProgress({ mapPath, step: stage.step, state: stage.state });

    currentCompilePromise.then((success) => {
        currentCompilePromise = undefined;
        stage.state = SharedMapCompileState.Completed;
        notifyCompileProgress({ mapPath, step: stage.step, state: stage.state });
    });
}
