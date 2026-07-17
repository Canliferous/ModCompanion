import { ipcMain } from "electron";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerImageMetaApi(): boolean {
    ipcMain.handle(
        Shared.Ipc.Channels.ImageGetMeta,
        (event, imageFilePath: string): Promise<Shared.ImageMeta.ImageMetaReport | undefined> =>
            getImageMeta(imageFilePath),
    );

    return true;
}

export async function getImageMeta(imageFilePath: string): Promise<Shared.ImageMeta.ImageMetaReport | undefined> {
    return new Promise((resolve) => {
        const worker = Core.WorkerSystem.createWorker(Shared.Workers.WorkerFile.ImageMeta, imageFilePath);
        worker.on("message", (result) => resolve(result));
    });
}
