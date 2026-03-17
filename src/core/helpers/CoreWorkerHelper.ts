import worker_threads from "node:worker_threads";
import path from "path";
import * as Core from "../CoreManifest.js";

export enum Worker {
    ImageMeta = "CoreImageMetaWorker",
    IndexFilesystem = "CoreIndexFilesystemWorker",
}
export function createWorker(worker: Worker, workerData: any) {
    return new worker_threads.Worker(path.join(Core.FileSystem.getRootDir(), "core", "workers", worker + ".cjs"), {
        workerData,
        execArgv: ["--inspect"],
    });
}
