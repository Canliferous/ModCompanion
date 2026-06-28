import worker_threads from "node:worker_threads";
import path from "path";
import * as Shared from "mod_companion_shared";
import { getRootDir } from "../helpers/CoreFilesystem.js";

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
    createWorker(workerFile: Shared.Workers.WorkerFile, workerData: any): worker_threads.Worker {
        const worker = new worker_threads.Worker(path.join(getRootDir(), "core", "workers", workerFile + ".cjs"), {
            workerData,
            execArgv: ["--inspect"],
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
};
