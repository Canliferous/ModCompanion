import { getAppConfig } from "~/renderer-config.js";
import SharedSourceFs from "Shared/SharedSourceFs.js";

export function getContentRelativePath(filePath: string): string {
    const config = getAppConfig();
    return SharedSourceFs.getRelativePath(filePath, config.contentPath, "content", config.gameName);
}

export function getGameRelativePath(filePath: string): string {
    const config = getAppConfig();
    return SharedSourceFs.getRelativePath(filePath, config.gamePath, "game", config.gameName);
}

export function getRootRelativePath(filePath: string): string {
    return SharedSourceFs.getRootRelativePath(filePath, getAppConfig().rootPath);
}

export function getGameOrContentRelativePath(filePath: string): string {
    const config = getAppConfig();
    return SharedSourceFs.getGameOrContentRelativePath(filePath, config.gameName, config.rootPath);
}
