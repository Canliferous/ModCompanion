// import { notifyCompileLog, notifyCompileProgress, notifyQueueUpdated } from "../../main/api/MainMapCompileApi.js";

import { ConfigSystem } from "./CoreConfigSystem.js";
import child_process from "node:child_process";
import * as Shared from "mod_companion_shared";
import {
    MapCompilerAction,
    runDone,
    runPostcompiler,
    runVBsp,
    runVRad,
    runVVis,
} from "../helpers/CoreMapCompilerLaunchers.js";

interface Stage {
    step: Shared.Map.SharedMapCompileStep;
    state: Shared.Map.CompileState;
    action: MapCompilerAction;
}

let queue: string[] = [];
let workerInterval: NodeJS.Timeout | undefined = undefined;
const mapQueueStages = new Map<string, Stage[]>();
let currentCompilePromise: Promise<boolean> | undefined = undefined;

let paused = false;

export const MapCompileSystem = {
    initSystem(): boolean {
        workerInterval = setInterval(_workQueue, 200);

        const config = ConfigSystem.getAppConfig();
        child_process.spawnSync(
            `chmod +x ${config.vbspExePath} ${config.postcompilerExePath} ${config.vvisExePath} ${config.vradExePath}`,
            {
                shell: true,
            },
        );

        return true;
    },
    enqueue(mapPaths: string[]): void {
        for (const mapPath of mapPaths) {
            if (queue.includes(mapPath)) {
                console.warn(`Map ${mapPath} is already in queue`);
                continue;
            }

            queue.push(mapPath);
            mapQueueStages.set(mapPath, _createStages());
        }

        // notifyQueueUpdated(); //todo
    },
    cancelQueue(): void {
        queue = [];
        mapQueueStages.clear();
    },
    setPaused(isPaused: boolean): void {
        paused = isPaused;
    },
    getQueue(): string[] {
        return queue;
    },
};

function _createStages(): Stage[] {
    return [
        {
            state: Shared.Map.CompileState.Idle,
            step: Shared.Map.SharedMapCompileStep.VBsp,
            action: runVBsp,
        },
        {
            state: Shared.Map.CompileState.Idle,
            step: Shared.Map.SharedMapCompileStep.Post,
            action: runPostcompiler,
        },
        {
            state: Shared.Map.CompileState.Idle,
            step: Shared.Map.SharedMapCompileStep.VVis,
            action: runVVis,
        },
        {
            state: Shared.Map.CompileState.Idle,
            step: Shared.Map.SharedMapCompileStep.VRad,
            action: runVRad,
        },
        {
            state: Shared.Map.CompileState.Idle,
            step: Shared.Map.SharedMapCompileStep.Done,
            action: runDone,
        },
    ];
}

function _workQueue() {
    if (queue.length === 0) return;

    for (let i = 0; i < queue.length; i++) {
        const steps = mapQueueStages.get(queue[i]);
        if (steps === undefined) {
            continue;
        }

        if (!_isStepsCompleted(steps)) {
            if (!paused) {
                _workMap(queue[i], steps);
            }
        } else {
            _mapFinished(queue[i]);
        }
    }
}

function _isStepsCompleted(steps: Stage[]): boolean {
    return !steps.some((s) => s.state !== Shared.Map.CompileState.Completed);
}

function _workMap(mapPath: string, steps: Stage[]) {
    const inProgressStepIdx = steps.findIndex((s) => s.state === Shared.Map.CompileState.InProgress);
    if (inProgressStepIdx > 0 || currentCompilePromise !== undefined) {
        return;
    }

    // Start next stage
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.state === Shared.Map.CompileState.Idle) {
            _startStage(mapPath, i);
            return;
        }
    }
}

function _mapFinished(mapPath: string): void {
    queue.splice(queue.indexOf(mapPath), 1);
    mapQueueStages.delete(mapPath);
    // notifyQueueUpdated(); //todo
}

function _startStage(mapPath: string, stageIdx: number): void {
    const stage = mapQueueStages.get(mapPath)![stageIdx];

    currentCompilePromise = stage.action(
        mapPath,
        (msg: string) => {
            // notifyCompileLog({ mapPath, message: msg, step: stage.step, isError: false }); //todo
        },
        (msg: string) => {
            // notifyCompileLog({ mapPath, message: msg, step: stage.step, isError: true }); // todo
        },
    );
    stage.state = Shared.Map.CompileState.InProgress;
    // notifyCompileProgress({ mapPath, step: stage.step, state: stage.state }); // todo

    currentCompilePromise.then(() => {
        _stageFinished(mapPath, stage);
    });
}

function _stageFinished(mapPath: string, stage: Stage): void {
    currentCompilePromise = undefined;
    stage.state = Shared.Map.CompileState.Completed;
    // notifyCompileProgress({ mapPath, step: stage.step, state: stage.state }); //todo
}
