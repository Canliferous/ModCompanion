import { ipcMain } from "electron";
import exifreader from "exifreader";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import fs from "fs/promises";

export function registerImageMetaApi(): boolean {
    ipcMain.handle(
        SharedIpcChannels.ImageGetMeta,
        (event, imageFilePath: string): Promise<SharedImageMetaReport | undefined> => getImageMeta(imageFilePath),
    );

    return true;
}

export async function getImageMeta(imageFilePath: string): Promise<SharedImageMetaReport | undefined> {
    try {
        const data = await fs.readFile(imageFilePath);
        const tags = exifreader.load(data);

        return {
            filePath: imageFilePath,
            tags,
            data: data.toString("base64"),
        };
    } catch (e) {
        console.warn("Failed to read image metadata from", imageFilePath, e);
        return undefined;
    }
}
