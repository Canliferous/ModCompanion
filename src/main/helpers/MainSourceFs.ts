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

export default {
    getContentRelativePath,
};
