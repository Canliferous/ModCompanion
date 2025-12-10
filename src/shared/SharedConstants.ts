const texturesFileEndings = [".png", ".jpg", ".tga", ".webp", "tiff", ".psd", ".hdr", ".exr"] as const;
const modelFileEndings = [".smd", ".qc", ".dmx", ".fbx"];

function isTextureFileEnding(sample: string) {
    return (texturesFileEndings as readonly string[]).includes(sample);
}

function isModelFileEnding(sample: string) {
    return (modelFileEndings as readonly string[]).includes(sample);
}

export default {
    texturesFileEndings,
    isTextureFileEnding,
    modelFileEndings,
    isModelFileEnding,
};
