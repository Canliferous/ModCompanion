import { notifyCompileLog, notifyCompileProgress, notifyQueueUpdated } from "../api/MainMapCompileApi.js";
import {
    MapCompilerAction,
    runDone,
    runPostcompiler,
    runVBsp,
    runVRad,
    runVVis,
} from "../launcher/MainMapCompilerLaunchers.js";
import { SharedMapCompileLogEventType } from "Shared/SharedMapCompileLogEvent.js";
import { SharedMapCompileState, SharedMapCompileStep } from "Shared/SharedMapCompile.js";

interface Stage {
    step: SharedMapCompileStep;
    state: SharedMapCompileState;
    action: MapCompilerAction;
}

const queue: string[] = [];
let workerInterval: NodeJS.Timeout | undefined = undefined;
const mapQueueStages = new Map<string, Stage[]>();
let currentCompilePromise: Promise<boolean> | undefined = undefined;

export const MapCompileSystem = {
    initSystem(): boolean {
        workerInterval = setInterval(_workQueue, 200);

        return true;
    },
    enqueue(mapPath: string) {
        if (queue.includes(mapPath)) {
            console.warn(`Map ${mapPath} is already in queue`);
            return;
        }

        queue.push(mapPath);
        mapQueueStages.set(mapPath, _createStages());
        notifyQueueUpdated();
    },
    getQueue(): string[] {
        return queue;
    },
};

function _createStages(): Stage[] {
    return [
        {
            state: SharedMapCompileState.Idle,
            step: SharedMapCompileStep.VBsp,
            action: runVBsp,
        },
        {
            state: SharedMapCompileState.Idle,
            step: SharedMapCompileStep.Post,
            action: runPostcompiler,
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
        {
            state: SharedMapCompileState.Idle,
            step: SharedMapCompileStep.Done,
            action: runDone,
        },
    ];
}

function _workQueue() {
    if (queue.length === 0) return;

    for (let i = 0; i < queue.length; i++) {
        let steps = mapQueueStages.get(queue[i]);
        if (steps === undefined) {
            continue;
        }

        if (!_isStepsCompleted(steps)) {
            _workMap(queue[i], steps);
        } else {
            _mapFinished(queue[i]);
        }
    }
}

function _isStepsCompleted(steps: Stage[]): boolean {
    return !steps.some((s) => s.state !== SharedMapCompileState.Completed);
}

function _workMap(mapPath: string, steps: Stage[]) {
    const inProgressStepIdx = steps.findIndex((s) => s.state === SharedMapCompileState.InProgress);
    if (inProgressStepIdx > 0 || currentCompilePromise !== undefined) {
        return;
    }

    // Start next stage
    for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        if (step.state === SharedMapCompileState.Idle) {
            _startStage(mapPath, i);
            return;
        }
    }
}

function _mapFinished(mapPath: string): void {
    queue.splice(queue.indexOf(mapPath), 1);
    mapQueueStages.delete(mapPath);
    notifyQueueUpdated();
}

function _startStage(mapPath: string, stageIdx: number): void {
    const stage = mapQueueStages.get(mapPath)![stageIdx];

    notifyCompileLog({ type: SharedMapCompileLogEventType.Clear, mapPath });
    currentCompilePromise = stage.action(
        mapPath,
        (msg: string) => {
            console.log(msg);
            notifyCompileLog({ type: SharedMapCompileLogEventType.AppendMessage, mapPath, message: msg });
        },
        (msg: string) => {
            console.log(msg);
            notifyCompileLog({ type: SharedMapCompileLogEventType.AppendError, mapPath, message: msg });
        },
    );
    stage.state = SharedMapCompileState.InProgress;
    notifyCompileProgress({ mapPath, step: stage.step, state: stage.state });

    currentCompilePromise.then(() => {
        _stageFinished(mapPath, stage);
    });
}

function _stageFinished(mapPath: string, stage: Stage): void {
    currentCompilePromise = undefined;
    stage.state = SharedMapCompileState.Completed;
    notifyCompileProgress({ mapPath, step: stage.step, state: stage.state });
}
