import SharedConstants from "Shared/SharedConstants.js";

export const AssetCreationInferResults = {
    Unknown: "unknown",
    Texture: "texture",
    Model: "model",
} as const;
export type AssetCreationInferResult = (typeof AssetCreationInferResults)[keyof typeof AssetCreationInferResults];

export function inferAssetCreationType(files: string[]): AssetCreationInferResult {
    if (files.length < 1) return AssetCreationInferResults.Unknown;

    if (_allTextureFiles(files)) {
        return AssetCreationInferResults.Texture;
    }

    if (_allModelFiles(files)) {
        return AssetCreationInferResults.Model;
    }

    return AssetCreationInferResults.Unknown;
}

function _allTextureFiles(files: string[]): boolean {
    for (let file of files) {
        if (!_isTextureFile(file)) return false;
    }

    return true;
}

function _allModelFiles(files: string[]): boolean {
    for (let file of files) {
        if (!_isModelFile(file)) return false;
    }

    return true;
}

function _isTextureFile(file: string): boolean {
    for (let ending of SharedConstants.texturesFileEndings) {
        if (file.endsWith(ending)) return true;
    }

    return false;
}

function _isModelFile(file: string): boolean {
    for (let ending of SharedConstants.modelFileEndings) {
        if (file.endsWith(ending)) return true;
    }

    return false;
}
