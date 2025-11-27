const texturesFileEndings = [".png", ".jpg", ".tga", ".webp", "tiff", ".psd", ".hdr", ".exr"] as const;

function isTextureFileEnding(sample: string) {
    return (texturesFileEndings as readonly string[]).includes(sample);
}

export default {
    texturesFileEndings,
    isTextureFileEnding,
};
