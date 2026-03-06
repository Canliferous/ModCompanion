import path from "path";
import { getAppConfig } from "../systems/CoreConfigSystem.js";
import * as Shared from "mod_companion_shared";

export function getContentRelativePath(filePath: string): string {
    const config = getAppConfig();
    return Shared.SourceFs.getRelativePath(filePath, config.contentPath, "content", config.gameName);
}

export function getGameRelativePath(filePath: string): string {
    const config = getAppConfig();
    return Shared.SourceFs.getRelativePath(filePath, config.gamePath, "game", config.gameName);
}

export function getGameOrContentRelativePath(filePath: string): string {
    const config = getAppConfig();
    return Shared.SourceFs.getGameOrContentRelativePath(filePath, config.gameName, config.rootPath);
}

export function isRelativeToRoot(filePath: string): boolean {
    return Shared.SourceFs.isRelativeToRoot(filePath, getAppConfig().gameName);
}

export function getRootRelativePath(filePath: string): string {
    return Shared.SourceFs.getRootRelativePath(filePath, getAppConfig().rootPath);
}

export function isAbsoluteContentFile(filePath: string): boolean {
    const config = getAppConfig();
    return filePath.toLowerCase().startsWith(config.contentPath.toLowerCase());
}

export function isAbsoluteGameFile(filePath: string): boolean {
    const config = getAppConfig();
    return filePath.toLowerCase().startsWith(config.gamePath.toLowerCase());
}

export function makeContentPathAbsolute(contentRelativePath: string): string {
    const config = getAppConfig();
    return path.join(config.contentPath, contentRelativePath);
}

export function makeGamePathAbsolute(gameRelativePath: string): string {
    const config = getAppConfig();
    return path.join(config.gamePath, gameRelativePath);
}

export default {
    getContentRelativePath,
    getGameRelativePath,
    isContentFile: isAbsoluteContentFile,
    isGameFile: isAbsoluteGameFile,
    makeContentPathAbsolute,
    makeGamePathAbsolute,
};
