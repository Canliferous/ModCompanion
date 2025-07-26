import { getConfig } from "../systems/MainConfigSystem.js";
import SharedSourceFs from "Shared/SharedSourceFs.js";

export function getContentRelativePath(filePath: string): string {
    const config = getConfig();
    return SharedSourceFs.getRelativePath(filePath, config.contentPath, "content", config.gameName);
}

export function getGameRelativePath(filePath: string): string {
    const config = getConfig();
    return SharedSourceFs.getRelativePath(filePath, config.gamePath, "game", config.gameName);
}

export function getGameOrContentRelativePath(filePath: string): string {
    const config = getConfig();
    return SharedSourceFs.getGameOrContentRelativePath(filePath, config.gameName, config.rootPath);
}

export function isRelativeToRoot(filePath: string): boolean {
    return SharedSourceFs.isRelativeToRoot(filePath, getConfig().gameName);
}

export function getRootRelativePath(filePath: string): string {
    return SharedSourceFs.getRootRelativePath(filePath, getConfig().rootPath);
}

export function isAbsoluteContentFile(filePath: string): boolean {
    const config = getConfig();
    return filePath.toLowerCase().startsWith(config.contentPath.toLowerCase());
}

export function isAbsoluteGameFile(filePath: string): boolean {
    const config = getConfig();
    return filePath.toLowerCase().startsWith(config.gamePath.toLowerCase());
}

export default {
    getContentRelativePath,
    getGameRelativePath,
    isContentFile: isAbsoluteContentFile,
    isGameFile: isAbsoluteGameFile,
};
