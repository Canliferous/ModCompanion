import { parentPort, workerData } from "worker_threads";
import fs from "fs/promises";
import exifreader from "exifreader";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";

async function runImageMetaWorker(input: any): Promise<SharedImageMetaReport | undefined> {
    if (typeof input !== "string") {
        return undefined;
    }

    try {
        const data = await fs.readFile(input);
        const tags = exifreader.load(data);
        const result: SharedImageMetaReport = {
            filePath: input,
            tags,
        };
        return result;
    } catch (e) {
        console.warn("Failed to read image metadata from", input, e);
        return undefined;
    }
}
runImageMetaWorker(workerData).then((result) => parentPort?.postMessage(result));
