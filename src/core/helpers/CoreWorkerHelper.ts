import * as Shared from "mod_companion_shared";
import * as worker_threads from "node:worker_threads";

/** Helper function to manage IO *inside* the worker */
export function useWorkerThreadData<K extends Shared.Workers.WorkerFile>(): Shared.Workers.AppWorkerData<
    Shared.Workers.WorkerArgs[K]
> {
    const data = worker_threads.workerData as Shared.Workers.AppWorkerData<Shared.Workers.WorkerArgs[K]>;
    return data;
}

export function useWorkerThreadMessages<K extends Shared.Workers.WorkerFile>(): Shared.Workers.AppWorkerMessages<
    Shared.Workers.WorkerDoneMessages[K],
    Shared.Workers.WorkerPostMessages[K]
> {
    function sendLog(channel: Shared.Log.Channel, type: Shared.Log.Type, data: any[]) {
        const message: Shared.Workers.WorkerMessageLog = {
            type: Shared.Workers.MessageType.Log,
            payload: { data, channel, time: new Date(), type },
        };
        worker_threads.parentPort?.postMessage(message);
    }

    function sendDone(payload: Shared.Workers.WorkerDoneMessages[K]) {
        const message: Shared.Workers.WorkerMessageDone<Shared.Workers.WorkerDoneMessages[K]> = {
            type: Shared.Workers.MessageType.Done,
            payload,
        };
        worker_threads.parentPort?.postMessage(message);
    }

    function sendPost(payload: Shared.Workers.WorkerPostMessages[K]) {
        const message: Shared.Workers.WorkerMessagePost<Shared.Workers.WorkerPostMessages[K]> = {
            type: Shared.Workers.MessageType.Post,
            payload,
        };
        worker_threads.parentPort?.postMessage(message);
    }

    return {
        log: {
            debug: (channel: Shared.Log.Channel, ...data: any[]) => sendLog(channel, Shared.Log.Type.Debug, data),
            info: (channel: Shared.Log.Channel, ...data: any[]) => sendLog(channel, Shared.Log.Type.Info, data),
            warning: (channel: Shared.Log.Channel, ...data: any[]) => sendLog(channel, Shared.Log.Type.Warning, data),
            error: (channel: Shared.Log.Channel, ...data: any[]) => sendLog(channel, Shared.Log.Type.Error, data),
        },
        done: sendDone,
        post: sendPost,
    };
}
