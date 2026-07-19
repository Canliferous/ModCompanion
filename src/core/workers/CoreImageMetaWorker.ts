import { parentPort, workerData } from "worker_threads";
import fs from "fs/promises";
import exifreader from "exifreader";
import * as Shared from "mod_companion_shared";
import { useWorkerThreadData } from "../helpers/CoreWorkerHelper.js";

const data = useWorkerThreadData<typeof Shared.Workers.WorkerFile.ImageMeta>();

runImageMetaWorker(data.args.filePath).then((result) => parentPort?.postMessage(result));

async function runImageMetaWorker(filePath: any): Promise<Shared.ImageMeta.ImageMetaReport | undefined> {
    if (typeof filePath !== "string") {
        return undefined;
    }

    try {
        const data = await fs.readFile(filePath);
        const tags = exifreader.load(data);
        const result: Shared.ImageMeta.ImageMetaReport = { filePath, tags };
        return result;
    } catch (e) {
        console.warn("Failed to read image metadata from", filePath, e);
        return undefined;
    }
}
