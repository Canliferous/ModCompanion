import { SharedAsset, SharedAssetHash, SharedAssetType } from "../../../shared/SharedAsset.js";
import path from "path";
import MainAssetRepository from "./MainAssetRepository.js";

const textureSourceExts = [".png", ".jpg", ".tga", ".tiff"];

export function isContentTextureSource(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return textureSourceExts.includes(ext);
}

export function buildContentTextureAssets(assets: Map<SharedAssetHash, SharedAsset>, files: string[]): void {
    for (const file of files) {
        if (isContentTextureSource(file)) {
            MainAssetRepository.addContentFileToAsset(assets, file.toLowerCase(), SharedAssetType.Texture);
        }
    }
}

export function buildGameTextureAssets(assets: Map<SharedAssetHash, SharedAsset>, files: string[]): void {
    for (let file of files) {
        const lowerFile = file.toLowerCase();
        const ext = path.extname(lowerFile);

        if (ext === ".vtf") {
            MainAssetRepository.addGameFileToAsset(assets, lowerFile, SharedAssetType.Texture);
        }
    }
}

export default { buildContentTextureAssets, buildGameTextureAssets, isContentTextureSource };
