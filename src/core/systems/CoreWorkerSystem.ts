import worker_threads from "node:worker_threads";
import * as pathe from "pathe";
import * as Shared from "mod_companion_shared";
import { getRootDir } from "../helpers/CoreFilesystem.js";
import { AppWorkerData } from "mod_companion_shared/SharedWorkers.js";
import { ConfigSystem } from "./CoreConfigSystem.js";

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

        return worker;
    },
    createResultWorker<K extends Shared.Workers.WorkerFile>(
        workerFile: K,
        workerArgs: Shared.Workers.WorkerArgs[K],
    ): Promise<Shared.Workers.WorkerResults[K] | undefined> {
        return new Promise((resolve) => {
            let result: Shared.Workers.WorkerResults[K] | undefined = undefined;
            const worker = WorkerSystem.createWorker(workerFile, workerArgs);
            worker.on("message", (r) => (result = r));
            worker.on("exit", () => resolve(result));
        });
    },
};
