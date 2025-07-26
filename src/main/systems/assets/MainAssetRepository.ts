import {
    SharedAsset,
    SharedAssetDefinition,
    SharedAssetDefinitionFileExtension,
    SharedAssetId,
    SharedAssetMap,
    SharedAssetType,
} from "Shared/SharedAssetDefinition.js";
import { notifyAssetsRescanned } from "../../api/MainAssetApi.js";
import { buildAssets } from "./MainAssetScanner.js";
import { scanContentTree } from "../files/MainFileScanner.js";
import { v4 } from "uuid";
import { isContentFile } from "../../helpers/MainSourceFs.js";
import path from "path";
import fs from "fs/promises";
import { getConfig } from "../MainConfigSystem.js";

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

export interface FileAddResult {
    asset: SharedAssetDefinition;
    created: boolean;
}

export interface FileRemoveResult {
    asset: SharedAssetDefinition;
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

// TODO: Collision check?
export function generateAssetId(): string {
    return v4();
}

export async function createAsset(files: string[]): Promise<SharedAsset | undefined> {
    if (files.length === 0) return undefined;

    if (files.length === 1) {
        const file = files[0];
        const isContent = isContentFile(file);
        const assetDef: SharedAssetDefinition = {
            type: SharedAssetType.Unknown, // TODO: Determine type
            id: generateAssetId(),
            contentFiles: isContent ? [file] : undefined,
            gameFiles: !isContent ? [file] : undefined,
            associatedFiles: undefined,
            displayName: file,
        };

        const mcaPath = file + SharedAssetDefinitionFileExtension;
        return await writeAssetDef(assetDef, mcaPath);
    }

    return undefined;
}

export async function writeAssetDef(assetDef: SharedAssetDefinition, mcaPath: string): Promise<SharedAsset> {
    const absoluteMcaPath = path.join(getConfig().contentPath, mcaPath);
    const payload = JSON.stringify(assetDef, undefined, 2);
    await fs.writeFile(absoluteMcaPath, payload);
    return { defFilePath: mcaPath, def: assetDef };
}

export function getAssetFromFile(filePath: string): SharedAsset | undefined {
    for (let asset of assetMap.values()) {
        if (asset.def.gameFiles?.includes(filePath)) return asset;
        if (asset.def.contentFiles?.includes(filePath)) return asset;
    }

    return undefined;
}

export function getAssetFromFiles(filePaths: string[]): SharedAsset | undefined {
    for (let asset of assetMap.values()) {
        for (const filePath of filePaths) {
            if (asset.def.gameFiles?.includes(filePath)) return asset;
            if (asset.def.contentFiles?.includes(filePath)) return asset;
        }
    }

    return undefined;
}

export function getAssetFromId(hash: SharedAssetId): SharedAsset | undefined {
    return assetMap.get(hash);
}

export default {
    rescan,
    getAssetFromFile,
    getAssetFromFiles,
    createAsset,
    getAssetFromId,
    writeAssetDef,
};
