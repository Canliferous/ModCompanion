export const texturesFileEndings = [".png", ".jpg", ".tga", ".webp", "tiff", ".psd", ".hdr", ".exr"] as const;
export const modelFileEndings = [".smd", ".qc", ".dmx", ".fbx"];

export function isTextureFileEnding(sample: string) {
    return (texturesFileEndings as readonly string[]).includes(sample);
}

export function isModelFileEnding(sample: string) {
    return (modelFileEndings as readonly string[]).includes(sample);
}
