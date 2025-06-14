import { SharedAsset, SharedAssetHash, SharedAssetMap, SharedAssetType } from "../../../shared/SharedAsset.js";
import { createHash } from "node:crypto";
import { filename } from "pathe/utils";
import MainAssetScanner, { AssetGroups } from "./MainAssetScanner.js";
import { notifyAssetsRescanned } from "../../api/MainAssetApi.js";
import MainAssetTextureScanner from "./MainAssetTextureScanner.js";

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

export function addContentFile(filePath: string, type: SharedAssetType): FileAddResult {
    return addFile(filePath, type, true);
}

export function addGameFile(filePath: string, type: SharedAssetType): FileAddResult {
    return addFile(filePath, type, false);
}

export default {
    addFile,
    addContentFile,
    // TODO: Move away
    addGameFile,
    createAssetHash,
    createAssetName,
    rescan,
    getAssetMap,
};
