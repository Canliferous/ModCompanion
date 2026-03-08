import { getAppConfig } from "~/renderer-config.js";
import * as Shared from "mod_companion_shared";

export function getContentRelativePath(filePath: string): string {
    const config = getAppConfig();
    return Shared.SourceFs.getRelativePath(filePath, config.contentPath, "content", config.gameName);
}

export function getGameRelativePath(filePath: string): string {
    const config = getAppConfig();
    return Shared.SourceFs.getRelativePath(filePath, config.gamePath, "game", config.gameName);
}

export function getRootRelativePath(filePath: string): string {
    return Shared.SourceFs.getRootRelativePath(filePath, getAppConfig().rootPath);
}

export function getGameOrContentRelativePath(filePath: string): string {
    const config = getAppConfig();
    return Shared.SourceFs.getGameOrContentRelativePath(filePath, config.gameName, config.rootPath);
}

export function isGameOrContentRelativePath(filePath: string): boolean {
    return filePath.startsWith("game") || filePath.startsWith("content");
}
