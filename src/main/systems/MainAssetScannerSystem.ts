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
    _rescan().then((a) => notifyAssetsRescanned({ assets: a }));
    return true;
}

async function _rescan(): Promise<Map<SharedAssetHash, SharedAsset>> {
    const { gameTree, contentTree } = await _scanGameAndContent();
    trees.contentTree = contentTree;
    trees.gameTree = gameTree;

    const contentGroups = _buildGroups(contentTree);
    const gameGroups = _buildGroups(gameTree);

    const assets = new Map<SharedAssetHash, SharedAsset>();
    _buildContentMaterialSrcAssets(assets, contentGroups.get("materialsrc") ?? []);
    return assets;
}

const materialSrcExts = [".png", ".jpg", ".tga", ".tiff"];
function _buildContentMaterialSrcAssets(assets: Map<SharedAssetHash, SharedAsset>, files: string[]): void {
    for (const file of files) {
        const ext = path.extname(file);
        if (materialSrcExts.includes(ext)) {
            const asset: SharedAsset = {
                displayName: filename(file) ?? "unknown",
                contentFiles: [file],
                gameFiles: [],
            };
            const hash = _createAssetHash(file);
            assets.set(hash, asset);
        }
    }
}

function _createAssetHash(assetPath: string): SharedAssetHash {
    const hasher = createHash("sha256");
    hasher.write(assetPath);
    return hasher.digest("hex");
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
