import { timeMillis } from "./SharedTiming.js";
import { AppConfig } from "./SharedAppConfig.js";
import pathe from "pathe";

export interface FileEntry {
    name: string;
    path: string;
    isFile: boolean;
    fileSize?: number;
}

export const SharedProjectListFilesReportTypes = {
    Success: 0,
    Invalid: 1,
} as const;
export type SharedProjectListFilesReportType =
    (typeof SharedProjectListFilesReportTypes)[keyof typeof SharedProjectListFilesReportTypes];

interface SharedProjectListFilesReportBase {
    type: SharedProjectListFilesReportType;
}

export interface SharedProjectListFilesReportSuccess extends SharedProjectListFilesReportBase {
    type: typeof SharedProjectListFilesReportTypes.Success;
    entries: FileEntry[];
}
export interface SharedProjectListFilesReportInvalid extends SharedProjectListFilesReportBase {
    type: typeof SharedProjectListFilesReportTypes.Invalid;
}

export type SharedProjectListFilesReport = SharedProjectListFilesReportSuccess | SharedProjectListFilesReportInvalid;

export type DirUpdatedNotifyFunc = (dir: string, entries: FileEntry[]) => void;

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

export function sortFileEntries(entries: FileEntry[]) {
    return timeMillis(() =>
        entries.toSorted((x, y) => {
            const file1 = x.isFile;
            const file2 = y.isFile;
            if (file1 !== file2) {
                return file1 ? 1 : -1;
            } else {
                return x.name.localeCompare(y.name);
            }
        }),
    );
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
