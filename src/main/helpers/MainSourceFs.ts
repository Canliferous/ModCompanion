import { getConfig } from "../systems/MainConfigSystem.js";
import path from "path";

export function getContentRelativePath(filePath: string): string {
    const config = getConfig();
    if (filePath.toLowerCase().startsWith(config.contentPath.toLowerCase())) {
        return filePath.substring(config.contentPath.length + 1).replaceAll("\\", "/");
    }

    return filePath;
}

export function getGameRelativePath(filePath: string): string {
    const config = getConfig();
    const gamePath = path.join(config.gamePath, config.gameName);
    if (filePath.toLowerCase().startsWith(gamePath.toLowerCase())) {
        return filePath.substring(gamePath.length + 1).replaceAll("\\", "/");
    }

    return filePath;
}

export function getRootRelativePath(filePath: string): string {
    const config = getConfig();

    const isRootRelative =
        filePath.startsWith(path.join("content", config.gameName)) ||
        filePath.startsWith(path.join("game", config.gameName));
    if (isRootRelative) {
        return path.join(config.rootPath, filePath);
    }

    return "";
}

export function isContentFile(filePath: string): boolean {
    const config = getConfig();
    return filePath.toLowerCase().startsWith(config.contentPath.toLowerCase());
}

export function isGameFile(filePath: string): boolean {
    const config = getConfig();
    return filePath.toLowerCase().startsWith(config.gamePath.toLowerCase());
}

export default {
    getContentRelativePath,
    getGameRelativePath,
    isContentFile,
    isGameFile,
};
