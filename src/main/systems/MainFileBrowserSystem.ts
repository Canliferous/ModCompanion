import chokidar, { FSWatcher } from "chokidar";
import { getAppConfig } from "./MainConfigSystem.js";
import path from "path";
import {
    SharedProjectFileEntry,
    SharedProjectListFilesReport,
    SharedProjectListFilesReportTypes,
} from "Shared/SharedFileListing.js";
import fs from "fs/promises";
import SharedSourceFs from "Shared/SharedSourceFs.js";
import { notifyFileBrowserDirectoryUpdated } from "../api/MainFileBrowserApi.js";

let watcher: FSWatcher | undefined;
let currentPathAbsolute: string | undefined = undefined;
let currentPathRelative: string | undefined = undefined;
export const FileBrowserSystem = {
    initSystem() {
        watcher = chokidar.watch([], { ignoreInitial: true, awaitWriteFinish: true });

        async function _change() {
            if (!currentPathAbsolute || !currentPathRelative) {
                return;
            }

            const report = await FileBrowserSystem.listFiles(currentPathAbsolute);
            if (report.type !== SharedProjectListFilesReportTypes.Success) {
                return;
            }

            notifyFileBrowserDirectoryUpdated({ dir: currentPathRelative, entries: report.entries });
        }

        watcher.on("add", _change);
        watcher.on("change", _change);
        watcher.on("unlink", _change);
        return true;
    },
    setCurrentDir(currentDir: string) {
        const config = getAppConfig();
        const fullPath = path.join(config.rootPath, currentDir);

        console.log("Watching", fullPath);
        if (currentPathAbsolute) {
            watcher?.unwatch(currentPathAbsolute);
        }
        currentPathAbsolute = fullPath;
        currentPathRelative = currentDir;

        watcher?.add(fullPath);
    },

    isProjectPath(p: string): boolean {
        const config = getAppConfig();
        return path.resolve(p).startsWith(config.rootPath);
    },

    correctProjectPath(somePath: string) {
        const config = getAppConfig();
        if (!path.isAbsolute(somePath)) {
            return somePath;
        }
        const ind = somePath.indexOf(config.rootPath);
        if (ind !== 0) return undefined;

        return SharedSourceFs.stripPathStart(somePath, config.rootPath);
    },

    sortFileEntries(entries: SharedProjectFileEntry[]) {
        entries.sort((x, y) => {
            const file1 = x.isFile;
            const file2 = y.isFile;
            if (file1 !== file2) {
                return file1 ? 1 : -1;
            } else {
                return x.name.localeCompare(y.name);
            }
        });
    },

    async listFiles(dirPath: string): Promise<SharedProjectListFilesReport> {
        if (!this.isProjectPath(dirPath)) return { type: SharedProjectListFilesReportTypes.Invalid };

        let paths: string[] = [];
        try {
            paths = await fs.readdir(dirPath);
        } catch (e) {
            console.warn(e);
            return { type: SharedProjectListFilesReportTypes.Invalid };
        }
        const entries: SharedProjectFileEntry[] = [];

        for (const p of paths) {
            if (p.startsWith(".")) continue;

            try {
                const s = await fs.stat(path.join(dirPath, p));
                if (s.isFile()) {
                    entries.push({
                        name: p,
                        path: path.join(dirPath, p).replaceAll("\\", "/"),
                        isFile: true,
                        fileSize: s.size,
                    });
                } else {
                    entries.push({
                        name: p,
                        path: path.join(dirPath, p).replaceAll("\\", "/"),
                        isFile: false,
                    });
                }
            } catch (e) {
                // Error is expected so don't print or throw.
                // Windows returns garbage paths that we can't read so just skip them
                // Like "System Volume Information", which exists when using the P:/ drive alias on the repo root
            }
        }
        this.sortFileEntries(entries);

        return { entries, type: SharedProjectListFilesReportTypes.Success };
    },
};
