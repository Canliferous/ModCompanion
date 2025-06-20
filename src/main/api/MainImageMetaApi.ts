import { ipcMain } from "electron";
import sharp from "sharp";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";

export function registerImageMetaApi(): boolean {
    ipcMain.handle(
        SharedIpcChannels.ImageGetMeta,
        (event, imageFilePath: string): Promise<SharedImageMetaReport | undefined> => getImageMeta(imageFilePath),
    );

    return true;
}

export async function getImageMeta(imageFilePath: string): Promise<SharedImageMetaReport | undefined> {
    try {
        const meta = await sharp(imageFilePath).metadata();
        return {
            filePath: imageFilePath,
            format: meta.format,
            width: meta.width,
            height: meta.height,
            fileSizeBytes: meta.size,
            bitDepth: meta.bitsPerSample,
            colorSpace: meta.space,
        };
    } catch (e) {
        return undefined;
    }
}
