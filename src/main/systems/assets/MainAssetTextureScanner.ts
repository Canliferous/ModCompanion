import { SharedAssetDefinition, SharedAssetId, SharedAssetType } from "Shared/SharedAssetDefinition.js";
import path from "path";
import MainAssetRepository from "./MainAssetRepository.js";

const textureSourceExts = [".png", ".jpg", ".tga", ".tiff"];

export function isContentTexture(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return textureSourceExts.includes(ext);
}

export function isGameTexture(filePath: string): boolean {
    return path.extname(filePath).toLowerCase() === ".vtf";
}

// export function buildContentTextureAssets(files: string[]): void {
//     for (const file of files) {
//         if (isContentTexture(file)) {
//             MainAssetRepository.addContentFile(file, SharedAssetType.Texture);
//         }
//     }
// }
//
// export function buildGameTextureAssets(files: string[]): void {
//     for (let file of files) {
//         if (isGameTexture(file)) {
//             MainAssetRepository.addGameFile(file, SharedAssetType.Texture);
//         }
//     }
// }

// export default { buildContentTextureAssets, buildGameTextureAssets, isContentTexture, isGameTexture };
