import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import path from "path";
import { getRootDir } from "Core/helpers/CoreFilesystem.js";
import { Worker } from "node:worker_threads";

export function registerImageMetaApi(): boolean {
    ipcMain.handle(
        SharedIpcChannels.ImageGetMeta,
        (event, imageFilePath: string): Promise<SharedImageMetaReport | undefined> => getImageMeta(imageFilePath),
    );

    return true;
}

export async function getImageMeta(imageFilePath: string): Promise<SharedImageMetaReport | undefined> {
    return new Promise((resolve) => {
        const worker = new Worker(path.join(getRootDir(), "main", "workers", "MainImageMetaWorker.js"), {
            workerData: imageFilePath,
        });
        worker.on("message", (result) => resolve(result));
    });
}
