import { SharedAsset, SharedAssetHash, SharedAssetType } from "../../../shared/SharedAsset.js";
import path from "path";
import MainAssetRepository from "./MainAssetRepository.js";

const textureSourceExts = [".png", ".jpg", ".tga", ".tiff"];

export function isContentTextureSource(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return textureSourceExts.includes(ext);
}

export function buildContentTextureAssets(files: string[]): void {
    for (const file of files) {
        if (isContentTextureSource(file)) {
            MainAssetRepository.addContentFile(file, SharedAssetType.Texture);
        }
    }
}

export function buildGameTextureAssets(files: string[]): void {
    for (let file of files) {
        const ext = path.extname(file).toLowerCase();

        if (ext === ".vtf") {
            MainAssetRepository.addGameFile(file, SharedAssetType.Texture);
        }
    }
}

export default { buildContentTextureAssets, buildGameTextureAssets, isContentTextureSource };
