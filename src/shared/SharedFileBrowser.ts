import { AppConfig } from "./SharedAppConfig.js";
import * as pathe from "pathe";

export interface FileEntry {
    name: string;
    path: string;
    isFile: boolean;
    fileSize?: number;
}

export interface FileEntries {
    entries: FileEntry[];
    valid: boolean;
}

export interface FileIndexMessage {
    dir: string;
    entries: FileEntry[];
}

export type DirUpdatedNotifyFunc = (dir: string, entries: FileEntries) => void;

export function isIgnoredPathName(name: string): boolean {
    return (
        name.startsWith(".") ||
        name === "src" ||
        name === "_sentry" ||
        name === "ContentBuilder" ||
        name === "venv" ||
        name === "node_modules"
    );
}

export function sortFileEntries(entries: FileEntries): FileEntry[] {
    if (!entries.valid || !entries.entries) {
        return [];
    }

    return entries.entries.toSorted((x, y) => {
        const file1 = x.isFile;
        const file2 = y.isFile;
        if (file1 !== file2) {
            return file1 ? 1 : -1;
        } else {
            return x.name.localeCompare(y.name);
        }
    });
}

export const PathBases = {
    Absolute: 0,
    RootRelative: 1,
    GameRelative: 2,
    ContentRelative: 3,
} as const;
export type PathBase = (typeof PathBases)[keyof typeof PathBases];

export function getBasePath(base: PathBase | undefined, config: AppConfig): string {
    switch (base) {
        case PathBases.RootRelative:
            return config.rootPath;
        case PathBases.GameRelative:
            return config.gamePath;
        case PathBases.ContentRelative:
            return config.contentPath;
        case PathBases.Absolute:
        default:
            return "";
    }
}

export function makeAbsolute(path: string, base: PathBase | undefined, config: AppConfig): string {
    return pathe.join(getBasePath(base, config), path);
}
