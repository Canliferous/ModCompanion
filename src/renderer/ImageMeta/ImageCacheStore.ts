import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";

export async function fetchImageMeta(imagePath: string): Promise<SharedImageMetaReport | undefined> {
    return await window.electronAPI.image.getMeta(imagePath);
}
