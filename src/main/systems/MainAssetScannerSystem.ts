import fs from "fs/promises";
import path from "path";
import { filename } from "pathe/utils";
import { getConfig } from "./MainConfigSystem.js";
import { timeMillisAsync } from "../helpers/MainTiming.js";
import { SharedAsset, SharedAssetHash } from "../../shared/SharedAsset.js";
import { notifyAssetsRescanned } from "../api/MainAssetApi.js";
import { createHash } from "node:crypto";

interface Trees {
    contentTree: string[];
    gameTree: string[];
}

const trees: Trees = {
    contentTree: [],
    gameTree: [],
};

export function initAssetScannerSystem(): boolean {
    return true;
}

export async function rescan() {
    console.log("Rescanning...");

    const startMillis = new Date().getTime();
    const assets = await _scanAssets();
    const endMillis = new Date().getTime();
    notifyAssetsRescanned({ assets, totalTimeMillis: endMillis - startMillis });
}

async function _scanAssets(): Promise<Map<SharedAssetHash, SharedAsset>> {
    const { gameTree, contentTree } = await _scanGameAndContent();
    trees.contentTree = contentTree;
    trees.gameTree = gameTree;

    const contentGroups = _buildGroups(contentTree);
    const gameGroups = _buildGroups(gameTree);

    const assets = new Map<SharedAssetHash, SharedAsset>();
    _buildContentMaterialSrcAssets(assets, contentGroups.get("materialsrc") ?? []);
    _buildGameMaterialAssets(assets, gameGroups.get("materials") ?? []);
    return assets;
}

function _addGameFilesToAsset(
    assets: Map<SharedAssetHash, SharedAsset>,
    assetHash: string,
    assetDisplayName: string,
    gameFiles: string[],
): void {
    if (!assets.has(assetHash)) {
        assets.set(assetHash, {
            displayName: assetDisplayName,
            contentFiles: [],
            gameFiles: gameFiles,
            hash: assetHash,
        });
        return;
    }

    const asset = assets.get(assetHash)!;
    asset.gameFiles.push(...gameFiles);
}

function _addGameFileToAsset(assets: Map<SharedAssetHash, SharedAsset>, gameFile: string): void {
    const displayName = _createAssetName(gameFile);
    const hash = _createAssetHash(gameFile);
    if (!assets.has(hash)) {
        assets.set(hash, {
            displayName: displayName,
            contentFiles: [],
            gameFiles: [gameFile],
            hash: hash,
        });
        return;
    }

    const asset = assets.get(hash)!;
    asset.gameFiles.push(gameFile);
}

function _addContentFilesToAsset(
    assets: Map<SharedAssetHash, SharedAsset>,
    assetHash: string,
    assetDisplayName: string,
    contentFiles: string[],
): void {
    if (!assets.has(assetHash)) {
        assets.set(assetHash, {
            displayName: assetDisplayName,
            contentFiles: contentFiles,
            gameFiles: [],
            hash: assetHash,
        });
        return;
    }

    const asset = assets.get(assetHash)!;
    asset.contentFiles.push(...contentFiles);
}

function _addContentFileToAsset(assets: Map<SharedAssetHash, SharedAsset>, contentFile: string): void {
    const displayName = _createAssetName(contentFile);
    const hash = _createAssetHash(contentFile);
    if (!assets.has(hash)) {
        assets.set(hash, {
            displayName: displayName,
            contentFiles: [contentFile],
            gameFiles: [],
            hash: hash,
        });
        return;
    }

    const asset = assets.get(hash)!;
    asset.contentFiles.push(contentFile);
}

const materialSrcExts = [".png", ".jpg", ".tga", ".tiff"];
function _buildContentMaterialSrcAssets(assets: Map<SharedAssetHash, SharedAsset>, files: string[]): void {
    for (const file of files) {
        const lowerFile = file.toLowerCase();
        const ext = path.extname(lowerFile);

        if (materialSrcExts.includes(ext)) {
            _addContentFileToAsset(assets, lowerFile);
        }
    }
}

function _buildGameMaterialAssets(assets: Map<SharedAssetHash, SharedAsset>, files: string[]): void {
    for (let file of files) {
        const lowerFile = file.toLowerCase();
        const ext = path.extname(lowerFile);

        if (ext === ".vtf") {
            _addGameFileToAsset(assets, lowerFile);
        }
    }
}

function _createAssetHash(assetPath: string): SharedAssetHash {
    const hasher = createHash("sha256");
    hasher.write(assetPath);
    return hasher.digest("hex");
}

function _createAssetName(fileName: string): string {
    return filename(fileName) ?? "unknown";
}

function _buildGroups(contentTree: string[]): Map<string, string[]> {
    const groups: Map<string, string[]> = new Map<string, string[]>();
    for (const str of contentTree) {
        const splits = str.split("/");
        if (splits.length < 1) continue;

        const firstPart = splits[0];
        if (!groups.has(firstPart)) {
            groups.set(firstPart, [str]);
        } else {
            groups.get(firstPart)?.push(str);
        }
    }

    return groups;
}

async function _scanGameAndContent(): Promise<{ gameTree: string[]; contentTree: string[] }> {
    const config = getConfig();
    const contentBasePath = path.join(config.contentPath, config.gameName);
    const gameBasePath = path.join(config.gamePath, config.gameName);

    console.log("Scanning content directory...");
    const { millis: millisContent, result: contentTree } = await timeMillisAsync(() =>
        _listFilesRecursive(contentBasePath.length + 1, contentBasePath),
    );
    console.log(`Scanned content directory in ${millisContent}ms`);
    console.log("Scanning game directory...");
    const { millis: millisGame, result: gameTree } = await timeMillisAsync(() =>
        _listFilesRecursive(gameBasePath.length + 1, gameBasePath),
    );
    console.log(`Scanned game directory in ${millisGame}ms`);

    console.log(`Scanned game and content in ${millisGame + millisContent}ms total`);
    return { gameTree, contentTree };
}

const ignoreFolderNames = ["node_modules", ".idea"];

async function _listFilesRecursive(baseDirLength: number, dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir);

    const files: string[] = [];
    for (let entry of entries) {
        const entryPath = path.join(dir, entry);
        const stat = await fs.stat(entryPath);
        if (stat.isDirectory()) {
            if (ignoreFolderNames.includes(entry)) continue;

            files.push(...(await _listFilesRecursive(baseDirLength, entryPath)));
        }

        if (stat.isFile()) {
            const file = entryPath.substring(baseDirLength).replaceAll("\\", "/");
            files.push(file);
        }
    }

    return files;
}
