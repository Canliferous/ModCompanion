import { SharedAsset, SharedAssetId, SharedAssetMap } from "Shared/SharedAsset.js";
import { notifyAssetsRescanned } from "../../api/MainAssetApi.js";
import { buildAssets } from "./MainAssetScanner.js";
import { v4 as uuidV4 } from "uuid";
import { scanContentTree } from "../files/MainFileScanner.js";

let assetMap: SharedAssetMap = new Map<SharedAssetId, SharedAsset>();

export function getAssetMap(): Readonly<SharedAssetMap> {
    return assetMap;
}

export async function rescan() {
    console.log("Rescanning...");

    const startMillis = new Date().getTime();
    const { contentTree, contentBasePath } = await scanContentTree();
    const endMillis = new Date().getTime();

    assetMap = await buildAssets(contentTree, contentBasePath);

    notifyAssetsRescanned({ assets: assetMap, totalTimeMillis: endMillis - startMillis });
}

export function createAssetId(): SharedAssetId {
    return uuidV4();
}

export function createAssetName(fileName: string): string {
    return fileName;
}

export interface FileAddResult {
    asset: SharedAsset;
    created: boolean;
}

export interface FileRemoveResult {
    asset: SharedAsset;
}

// export function addFile(filePath: string, type: SharedAssetType, isContentFile?: boolean): FileAddResult {
//     const file = filePath.toLowerCase();
//     const displayName = createAssetName(file);
//     const hash = createAssetHash(file);
//     if (!assetMap.has(hash)) {
//         const asset: SharedAsset = {
//             displayName: displayName,
//             contentFiles: isContentFile ? [file] : [],
//             gameFiles: !isContentFile ? [file] : [],
//             id: hash,
//             type,
//         };
//         assetMap.set(hash, asset);
//         return { asset, created: true };
//     }
//
//     const asset = assetMap.get(hash)!;
//     let arr = isContentFile ? asset.contentFiles : asset.gameFiles;
//     if (arr?.includes(file)) {
//         return { asset, created: false };
//     }
//
//     if(arr) {
//         arr.push(file);
//     } else {
//         arr = [file];
//     }
//
//     return { asset, created: false };
// }

// export function removeFile(filePath: string): FileRemoveResult | undefined {
//     let isContent = MainSourceFs.isContentFile(filePath);
//     const relativePath = isContent
//         ? MainSourceFs.getContentRelativePath(filePath)
//         : MainSourceFs.getGameRelativePath(filePath);
//
//     const assetHash = getAssetFromFile(relativePath);
//     if (!assetHash) return undefined;
//
//     const asset = getAssetFromHash(assetHash);
//     if (!asset) return undefined;
//
//     if (isContent) {
//         asset.contentFiles.splice(asset.contentFiles.indexOf(relativePath), 1);
//     } else {
//         asset.gameFiles.splice(asset.gameFiles.indexOf(relativePath), 1);
//     }
//
//     assetMap.set(assetHash, asset);
//
//     return {
//         asset,
//     };
// }

// export function addContentFile(filePath: string, type: SharedAssetType): FileAddResult {
//     return addFile(filePath, type, true);
// }
//
// export function addGameFile(filePath: string, type: SharedAssetType): FileAddResult {
//     return addFile(filePath, type, false);
// }

export function getAssetFromFile(filePath: string): SharedAssetId | undefined {
    for (let asset of assetMap.values()) {
        if (asset.gameFiles?.includes(filePath)) return asset.id;
        if (asset.contentFiles?.includes(filePath)) return asset.id;
    }

    return undefined;
}

export function getAssetFromId(hash: SharedAssetId): SharedAsset | undefined {
    return assetMap.get(hash);
}

export default {
    createAssetId,
    createAssetName,
    rescan,
    getAssetMap,
    getAssetFromFile,
    getAssetFromHash: getAssetFromId,
};
