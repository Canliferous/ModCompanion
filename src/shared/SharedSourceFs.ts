import pathe from "pathe";

export function getRelativePath(
    filePath: string,
    absolutePrefix: string,
    relativePrefix: string,
    gameName: string,
): string {
    const file = forwardSlashed(filePath.toLowerCase());
    const prefix = forwardSlashed(absolutePrefix.toLowerCase());

    const isAbsolute = file.startsWith(prefix);
    if (isAbsolute) {
        return stripPathStart(filePath, absolutePrefix);
    }

    const relative = pathe.join(relativePrefix, gameName);
    const isRelativeToGameRoot = file.startsWith(relative);
    if (isRelativeToGameRoot) {
        return stripPathStart(filePath, relative);
    }

    return filePath;
}

export function getGameOrContentRelativePath(filePath: string, gameName: string, rootPath: string): string {
    const file = forwardSlashed(filePath);
    const root = forwardSlashed(rootPath);

    const isAbsolute = file.startsWith(root);
    let start = isAbsolute ? rootPath.length : 0;

    if (file.startsWith(pathe.join("content", gameName), start)) {
        start += "content".length;
    } else if (file.startsWith(pathe.join("game", gameName), start)) {
        start += "game".length;
    }

    start += gameName.length + 2; // 2 slashes
    return forwardSlashed(file.substring(start));
}

export function getRootRelativePath(filePath: string, rootPath: string): string {
    const file = forwardSlashed(filePath);
    const root = forwardSlashed(rootPath);

    const isAbsolute = file.startsWith(root);
    if (isAbsolute) {
        return forwardSlashed(file.substring(rootPath.length + 1));
    }

    return filePath;
}

export function isRelativeToRoot(filePath: string, gameName: string): boolean {
    return filePath.startsWith("content" + "/" + gameName) || filePath.startsWith("game" + "/" + gameName);
}

export function forwardSlashed(str: string): string {
    return str.replace(/\\/g, "/");
}

export function stripPathStart(filePath: string, prefix: string): string {
    return forwardSlashed(filePath.substring(prefix.length + 1));
}
