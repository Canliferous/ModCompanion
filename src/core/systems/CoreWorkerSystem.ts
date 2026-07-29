import worker_threads from "node:worker_threads";
import * as pathe from "pathe";
import * as Shared from "mod_companion_shared";
import { getRootDir } from "../helpers/CoreFilesystem.js";
import { AppWorkerData } from "mod_companion_shared/SharedWorkers.js";
import { ConfigSystem } from "./CoreConfigSystem.js";
import { Logger } from "./CoreLogSystem.js";

const workerList: worker_threads.Worker[] = [];

export const WorkerSystem = {
    initSystem(): boolean {
        return true;
    },
    deinitSystem(): void {
        for (const worker of workerList) {
            worker.terminate();
        }
    },
    createWorker<K extends Shared.Workers.WorkerFile>(
        workerFile: K,
        workerArgs: Shared.Workers.WorkerArgs[K],
        doneCallback?: (payload: Shared.Workers.WorkerDoneMessages[K]) => void,
        postCallback?: (payload: Shared.Workers.WorkerPostMessages[K]) => void,
    ): worker_threads.Worker {
        const data: AppWorkerData<Shared.Workers.WorkerArgs[K]> = {
            args: workerArgs,
            common: {
                appConfig: ConfigSystem.getAppConfig(),
            },
        };

        const workerStartFile = pathe.join(getRootDir(), "core", "workers", workerFile + ".cjs");
        const worker = new worker_threads.Worker(workerStartFile, {
            workerData: data,
            // execArgv: ["--inspect"], // enable if needed for debugging
        });

        workerList.push(worker);

        worker.on("exit", () => {
            const index = workerList.indexOf(worker);
            if (index >= 0) {
                workerList.splice(index, 1);
            }
        });

        worker.on("message", (data: Shared.Workers.WorkerMessage<Shared.Workers.MessageType, any>) => {
            if (data.type === Shared.Workers.MessageType.Log) {
                Logger.processLog(data.payload, true);
            } else if (data.type === Shared.Workers.MessageType.Done) {
                doneCallback?.(data.payload as Shared.Workers.WorkerDoneMessages[K]);
            } else if (data.type === Shared.Workers.MessageType.Post) {
                postCallback?.(data.payload as Shared.Workers.WorkerPostMessages[K]);
            }
        });

        return worker;
    },
    createResultWorker<K extends Shared.Workers.WorkerFile>(
        workerFile: K,
        workerArgs: Shared.Workers.WorkerArgs[K],
    ): Promise<Shared.Workers.WorkerDoneMessages[K] | undefined> {
        return new Promise((resolve) => {
            let result: Shared.Workers.WorkerDoneMessages[K] | undefined = undefined;
            const worker = WorkerSystem.createWorker(workerFile, workerArgs, (payload) => (result = payload));
            worker.on("exit", () => resolve(result));
        });
    },
};
