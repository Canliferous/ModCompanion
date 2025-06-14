import { getConfig } from "../MainConfigSystem.js";
import path from "path";
import { timeMillisAsync } from "../../helpers/MainTiming.js";
import fs from "fs/promises";

export interface AssetGroups {
    content: Map<string, string[]>;
    game: Map<string, string[]>;
}

export async function scanAssets(): Promise<AssetGroups> {
    const { gameTree, contentTree } = await _scanGameAndContent();

    const contentGroups = _buildGroups(contentTree);
    const gameGroups = _buildGroups(gameTree);

    return { content: contentGroups, game: gameGroups };
}

export default { scanAssets };

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
