import { notifyCompileLog, notifyQueueUpdated } from "../api/MainMapCompileApi.js";
import { MapCompilerAction, runVBsp, runVRad, runVVis } from "../launcher/MainMapCompilerLaunchers.js";
import { MapCompileLogEventType } from "../../shared/MapCompileLogEvent.js";

enum CompileState {
    Idle,
    InProgress,
    Completed,
}

interface CompileStep {
    name: string;
    state: CompileState;
    action: MapCompilerAction;
    log: string;
}

const mapQueue: string[] = [];
let workerInterval: NodeJS.Timeout | undefined = undefined;
const mapQueueSteps = new Map<string, CompileStep[]>();
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
    mapQueueSteps.set(mapPath, _createSteps());
    notifyQueueUpdated();
}

export function getMapQueue(): string[] {
    return mapQueue;
}

function _createSteps(): CompileStep[] {
    return [
        {
            log: "",
            state: CompileState.Idle,
            name: "VBSP",
            action: runVBsp,
        },
        {
            log: "",
            state: CompileState.Idle,
            name: "VVIS",
            action: runVVis,
        },
        {
            log: "",
            state: CompileState.Idle,
            name: "VRAD",
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

function _isStepsCompleted(steps: CompileStep[]): boolean {
    return !steps.some((s) => s.state !== CompileState.Completed);
}

function _getQueueWorkItem(): { mapPath: string; steps: CompileStep[] } | undefined {
    for (let i = 0; i < mapQueue.length; i++) {
        let steps = mapQueueSteps.get(mapQueue[i]);
        if (steps === undefined) {
            continue;
        }

        if (!_isStepsCompleted(steps)) {
            return { mapPath: mapQueue[i], steps };
        }
    }

    return undefined;
}

function _workMap(mapPath: string, steps: CompileStep[]) {
    const inProgressStepIdx = steps.findIndex((s) => s.state === CompileState.InProgress);
    if (inProgressStepIdx > 0 || currentCompilePromise !== undefined) {
        return;
    }

    for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        if (step.state === CompileState.Idle) {
            _startStep(mapPath, i);
            return;
        }
    }
}

function _startStep(mapPath: string, stepIdx: number) {
    const step = mapQueueSteps.get(mapPath)![stepIdx];
    console.log("Starting step", step);

    notifyCompileLog({ type: MapCompileLogEventType.Clear, mapPath });
    currentCompilePromise = step.action(
        mapPath,
        (msg: string) => {
            notifyCompileLog({ type: MapCompileLogEventType.AppendMessage, mapPath, message: msg });
        },
        (msg: string) => {
            notifyCompileLog({ type: MapCompileLogEventType.AppendError, mapPath, message: msg });
        },
    );
    step.state = CompileState.InProgress;

    currentCompilePromise.then((success) => {
        currentCompilePromise = undefined;
    });
}
