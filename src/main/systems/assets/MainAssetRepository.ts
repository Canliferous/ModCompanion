import { SharedAsset, SharedAssetHash, SharedAssetMap, SharedAssetType } from "../../../shared/SharedAsset.js";
import { createHash } from "node:crypto";
import { filename } from "pathe/utils";
import MainAssetScanner, { AssetGroups } from "./MainAssetScanner.js";
import { notifyAssetsRescanned } from "../../api/MainAssetApi.js";
import MainAssetTextureScanner from "./MainAssetTextureScanner.js";
import MainSourceFs from "../../helpers/MainSourceFs.js";

let assetMap: SharedAssetMap = new Map<SharedAssetHash, SharedAsset>();

export function getAssetMap(): Readonly<SharedAssetMap> {
    return assetMap;
}

export async function rescan() {
    console.log("Rescanning...");

    const startMillis = new Date().getTime();
    const groups = await MainAssetScanner.scanAssets();
    const endMillis = new Date().getTime();

    assetMap = new Map<SharedAssetHash, SharedAsset>();
    _buildAssets(groups);
    notifyAssetsRescanned({ assets: assetMap, totalTimeMillis: endMillis - startMillis });
}

function _buildAssets(groups: AssetGroups) {
    MainAssetTextureScanner.buildContentTextureAssets(groups.content.get("materialsrc") ?? []);
    MainAssetTextureScanner.buildGameTextureAssets(groups.game.get("materials") ?? []);
}

export function createAssetHash(assetPath: string): SharedAssetHash {
    const hasher = createHash("sha256");
    hasher.write(filename(assetPath.toLowerCase()));
    return hasher.digest("hex");
}

export function createAssetName(fileName: string): string {
    return filename(fileName) ?? "unknown";
}

export interface FileAddResult {
    asset: SharedAsset;
    created: boolean;
}

export interface FileRemoveResult {
    asset: SharedAsset;
}

export function addFile(filePath: string, type: SharedAssetType, isContentFile?: boolean): FileAddResult {
    const file = filePath.toLowerCase();
    const displayName = createAssetName(file);
    const hash = createAssetHash(file);
    if (!assetMap.has(hash)) {
        const asset: SharedAsset = {
            displayName: displayName,
            contentFiles: isContentFile ? [file] : [],
            gameFiles: !isContentFile ? [file] : [],
            hash: hash,
            type,
        };
        assetMap.set(hash, asset);
        return { asset, created: true };
    }

    const asset = assetMap.get(hash)!;
    const arr = isContentFile ? asset.contentFiles : asset.gameFiles;
    if (arr.includes(file)) {
        return { asset, created: false };
    }

    arr.push(file);
    return { asset, created: false };
}

export function removeFile(filePath: string): FileRemoveResult | undefined {
    let isContent = MainSourceFs.isContentFile(filePath);
    const relativePath = isContent
        ? MainSourceFs.getContentRelativePath(filePath)
        : MainSourceFs.getGameRelativePath(filePath);

    const assetHash = getAssetFromFile(relativePath);
    if (!assetHash) return undefined;

    const asset = getAssetFromHash(assetHash);
    if (!asset) return undefined;

    if (isContent) {
        asset.contentFiles.splice(asset.contentFiles.indexOf(relativePath), 1);
    } else {
        asset.gameFiles.splice(asset.gameFiles.indexOf(relativePath), 1);
    }

    assetMap.set(assetHash, asset);

    return {
        asset,
    };
}

export function addContentFile(filePath: string, type: SharedAssetType): FileAddResult {
    return addFile(filePath, type, true);
}

export function addGameFile(filePath: string, type: SharedAssetType): FileAddResult {
    return addFile(filePath, type, false);
}

export function getAssetFromFile(filePath: string): SharedAssetHash | undefined {
    for (let asset of assetMap.values()) {
        if (asset.gameFiles.includes(filePath)) return asset.hash;
        if (asset.contentFiles.includes(filePath)) return asset.hash;
    }

    return undefined;
}

export function getAssetFromHash(hash: SharedAssetHash): SharedAsset | undefined {
    return assetMap.get(hash);
}

export default {
    addFile,
    addContentFile,
    addGameFile,
    removeFile,
    createAssetHash,
    createAssetName,
    rescan,
    getAssetMap,
    getAssetFromFile,
    getAssetFromHash,
};
