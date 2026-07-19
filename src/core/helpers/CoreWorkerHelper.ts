import * as Shared from "mod_companion_shared";
import * as worker_threads from "node:worker_threads";

/** Helper function to manage IO *inside* the worker */
export function useWorkerThreadData<K extends Shared.Workers.WorkerFile>(): Shared.Workers.AppWorkerData<
    Shared.Workers.WorkerArgs[K]
> {
    const data = worker_threads.workerData as Shared.Workers.AppWorkerData<Shared.Workers.WorkerArgs[K]>;
    return data;
}
