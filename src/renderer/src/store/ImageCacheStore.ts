import * as Shared from "mod_companion_shared";

export async function fetchImageMeta(imagePath: string): Promise<Shared.ImageMeta.ImageMetaReport | undefined> {
    return await window.electronAPI.image.getMeta(imagePath);
}
