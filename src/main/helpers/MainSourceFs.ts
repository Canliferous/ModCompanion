import { getConfig } from "../systems/MainConfigSystem.js";
import path from "path";

export function getContentRelativePath(filePath: string): string {
    const config = getConfig();
    const contentPath = path.join(config.contentPath, config.gameName);
    if (filePath.toLowerCase().startsWith(contentPath.toLowerCase())) {
        return filePath.substring(contentPath.length + 1);
    }

    return filePath;
}

export function getGameRelativePath(filePath: string): string {
    const config = getConfig();
    const gamePath = path.join(config.gamePath, config.gameName);
    if (filePath.toLowerCase().startsWith(gamePath.toLowerCase())) {
        return filePath.substring(gamePath.length + 1);
    }

    return filePath;
}

export function isContentFile(filePath: string): boolean {
    const config = getConfig();
    const contentPath = path.join(config.contentPath, config.gameName);
    return filePath.toLowerCase().startsWith(contentPath.toLowerCase());
}

export function isGameFile(filePath: string): boolean {
    const config = getConfig();
    const gamePath = path.join(config.gamePath, config.gameName);
    return filePath.toLowerCase().startsWith(gamePath.toLowerCase());
}

export default {
    getContentRelativePath,
    getGameRelativePath,
    isContentFile,
    isGameFile,
};
