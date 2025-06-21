import { ipcMain } from "electron";
import sharp from "sharp";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedImageChannels, SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
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
        const img = sharp(imageFilePath);
        const stats = await fs.stat(imageFilePath);
        const meta = await img.metadata();
        const imgBuffer = await img.toFormat("png").toBuffer();
        const channels = await getRgbaChannelBuffers(img, meta.channels);

        return {
            filePath: imageFilePath,
            format: meta.format,
            width: meta.width,
            height: meta.height,
            fileSizeBytes: stats.size,
            colorSpace: meta.space,
            bitDepth: meta.bitsPerSample,
            data: imgBuffer.toString("base64"),
            channels,
        };
    } catch (e) {
        console.warn("Failed to read image metadata from", imageFilePath, e);
        return undefined;
    }
}

async function _getChannelBuffer(
    img: sharp.Sharp,
    channel: 0 | 1 | 2 | 3,
    channels: sharp.Channels,
): Promise<string | undefined> {
    if (channels <= channel) return;

    const buffer = await img.extractChannel(channel).toFormat("png").toBuffer();
    return buffer.toString("base64");
}

export async function getRgbaChannelBuffers(img: sharp.Sharp, channels: sharp.Channels): Promise<SharedImageChannels> {
    return {
        redData: await _getChannelBuffer(img, 0, channels),
        greenData: await _getChannelBuffer(img, 1, channels),
        blueData: await _getChannelBuffer(img, 2, channels),
        alphaData: await _getChannelBuffer(img, 3, channels),
    };
}
