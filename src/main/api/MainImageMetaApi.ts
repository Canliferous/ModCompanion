import { ipcMain } from "electron";
import path from "path";
import { Worker } from "node:worker_threads";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerImageMetaApi(): boolean {
    ipcMain.handle(
        Shared.Ipc.Channels.ImageGetMeta,
        (event, imageFilePath: string): Promise<Shared.ImageMeta.SharedImageMetaReport | undefined> =>
            getImageMeta(imageFilePath),
    );

    return true;
}

export async function getImageMeta(imageFilePath: string): Promise<Shared.ImageMeta.SharedImageMetaReport | undefined> {
    return new Promise((resolve) => {
        const worker = new Worker(
            path.join(Core.FileSystem.getRootDir(), "main", "workers", "MainImageMetaWorker.js"),
            {
                workerData: imageFilePath,
            },
        );
        worker.on("message", (result) => resolve(result));
    });
}
