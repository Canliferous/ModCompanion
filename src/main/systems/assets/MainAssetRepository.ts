import { SharedAsset, SharedAssetHash, SharedAssetMap, SharedAssetType } from "../../../shared/SharedAsset.js";
import { createHash } from "node:crypto";
import { filename } from "pathe/utils";
import MainAssetScanner from "./MainAssetScanner.js";
import { notifyAssetsRescanned } from "../../api/MainAssetApi.js";

let assetMap: SharedAssetMap = new Map<SharedAssetHash, SharedAsset>();

export function getAssetMap(): Readonly<SharedAssetMap> {
    return assetMap;
}

export async function rescan() {
    console.log("Rescanning...");

    const startMillis = new Date().getTime();
    const assets = await MainAssetScanner.scanAssets();
    const endMillis = new Date().getTime();
    assetMap = assets;
    notifyAssetsRescanned({ assets, totalTimeMillis: endMillis - startMillis });
}

export function createAssetHash(assetPath: string): SharedAssetHash {
    const hasher = createHash("sha256");
    hasher.write(filename(assetPath.toLowerCase()));
    return hasher.digest("hex");
}

export function createAssetName(fileName: string): string {
    return filename(fileName) ?? "unknown";
}

export function addGameFileToAsset(
    assets: Map<SharedAssetHash, SharedAsset>,
    gameFile: string,
    type: SharedAssetType,
): void {
    const displayName = createAssetName(gameFile);
    const hash = createAssetHash(gameFile);
    if (!assets.has(hash)) {
        assets.set(hash, {
            displayName: displayName,
            contentFiles: [],
            gameFiles: [gameFile],
            hash: hash,
            type,
        });
        return;
    }

    const asset = assets.get(hash)!;
    asset.gameFiles.push(gameFile);
}

export function addContentFileToAsset(
    assets: Map<SharedAssetHash, SharedAsset>,
    contentFile: string,
    type: SharedAssetType,
): void {
    const displayName = createAssetName(contentFile);
    const hash = createAssetHash(contentFile);
    if (!assets.has(hash)) {
        assets.set(hash, {
            displayName: displayName,
            contentFiles: [contentFile],
            gameFiles: [],
            hash: hash,
            type,
        });
        return;
    }

    const asset = assets.get(hash)!;
    asset.contentFiles.push(contentFile);
}

export function addGameFilesToAsset(
    assets: Map<SharedAssetHash, SharedAsset>,
    assetHash: string,
    assetDisplayName: string,
    gameFiles: string[],
    type: SharedAssetType,
): void {
    if (!assets.has(assetHash)) {
        assets.set(assetHash, {
            displayName: assetDisplayName,
            contentFiles: [],
            gameFiles: gameFiles,
            hash: assetHash,
            type,
        });
        return;
    }

    const asset = assets.get(assetHash)!;
    asset.gameFiles.push(...gameFiles);
}

export function addContentFilesToAsset(
    assets: Map<SharedAssetHash, SharedAsset>,
    assetHash: string,
    assetDisplayName: string,
    contentFiles: string[],
    type: SharedAssetType,
): void {
    if (!assets.has(assetHash)) {
        assets.set(assetHash, {
            displayName: assetDisplayName,
            contentFiles: contentFiles,
            gameFiles: [],
            hash: assetHash,
            type,
        });
        return;
    }

    const asset = assets.get(assetHash)!;
    asset.contentFiles.push(...contentFiles);
}

export default {
    addContentFileToAsset,
    addContentFilesToAsset,
    addGameFileToAsset,
    addGameFilesToAsset,
    createAssetHash,
    createAssetName,
    rescan,
    getAssetMap,
};
