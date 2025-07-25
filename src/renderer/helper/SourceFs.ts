import { getAppConfig } from "~/renderer-config.js";
import pathe from "pathe";

export function getContentRelativePath(filePath: string): string {
    const config = getAppConfig();
    const file = filePath.toLowerCase();
    const content = config.contentPath.toLowerCase();

    const isAbsolute = file.startsWith(content);
    if (isAbsolute) {
        return filePath.substring(config.contentPath.length + 1).replaceAll("\\", "/");
    }

    const relativePrefix = pathe.join("content", config.gameName);
    const isRelativeToGameRoot = file.startsWith(relativePrefix);
    if (isRelativeToGameRoot) {
        return filePath.substring(relativePrefix.length + 1).replaceAll("\\", "/");
    }

    return filePath;
}
