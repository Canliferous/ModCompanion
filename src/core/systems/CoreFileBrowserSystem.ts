import chokidar, { FSWatcher } from "chokidar";
import { ConfigSystem } from "./CoreConfigSystem.js";
import path from "path";
import fs from "fs/promises";
import { Logger } from "./CoreLogSystem.js";
import * as Shared from "mod_companion_shared";
// import { notifyFileBrowserDirectoryUpdated } from "../../main/api/MainFileBrowserApi.js";

let watcher: FSWatcher | undefined;
let currentPathAbsolute: string | undefined = undefined;
let currentPathRelative: string | undefined = undefined;
export const FileBrowserSystem = {
    initSystem() {
        watcher = chokidar.watch([], { ignoreInitial: true, awaitWriteFinish: true, depth: 0 });

        async function _change(filePath: string) {
            Logger.debug(Shared.Log.Channel.FileBrowser, "File changed", filePath);
            if (!currentPathAbsolute || !currentPathRelative) {
                return;
            }

            const report = await FileBrowserSystem.listFiles(currentPathAbsolute);
            if (report.type !== Shared.FileListing.SharedProjectListFilesReportTypes.Success) {
                return;
            }

            // todo
            // notifyFileBrowserDirectoryUpdated({ dir: currentPathRelative, entries: report.entries });
        }

        watcher.on("add", _change);
        watcher.on("change", _change);
        watcher.on("unlink", _change);
        return true;
    },
    setCurrentDir(currentDir: string) {
        const config = ConfigSystem.getAppConfig();
        const fullPath = path.join(config.rootPath, currentDir);

        Logger.info(Shared.Log.Channel.FileBrowser, "Watching", fullPath);
        if (currentPathAbsolute) {
            watcher?.unwatch(currentPathAbsolute);
        }
        currentPathAbsolute = fullPath;
        currentPathRelative = currentDir;

        watcher?.add(fullPath);
    },

    isProjectPath(p: string): boolean {
        const config = ConfigSystem.getAppConfig();
        return path.resolve(p).startsWith(config.rootPath);
    },

    correctProjectPath(somePath: string) {
        const config = ConfigSystem.getAppConfig();
        if (!path.isAbsolute(somePath)) {
            return somePath;
        }
        const ind = somePath.indexOf(config.rootPath);
        if (ind !== 0) return undefined;

        return Shared.SourceFs.stripPathStart(somePath, config.rootPath);
    },

    sortFileEntries(entries: Shared.FileListing.SharedProjectFileEntry[]) {
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

    async listFiles(
        dirPath: string,
        resultBaseRoot?: string,
    ): Promise<Shared.FileListing.SharedProjectListFilesReport> {
        if (!this.isProjectPath(dirPath)) return { type: Shared.FileListing.SharedProjectListFilesReportTypes.Invalid };

        let paths: string[] = [];
        try {
            paths = await fs.readdir(dirPath);
        } catch (e) {
            console.warn(e);
            return { type: Shared.FileListing.SharedProjectListFilesReportTypes.Invalid };
        }
        const entries: Shared.FileListing.SharedProjectFileEntry[] = [];

        for (const p of paths) {
            if (p.startsWith(".")) continue;

            try {
                const s = await fs.stat(path.join(dirPath, p));
                const entryPath = path.join(resultBaseRoot ?? dirPath, p).replaceAll("\\", "/");
                if (s.isFile()) {
                    entries.push({
                        name: p,
                        path: entryPath,
                        isFile: true,
                        fileSize: s.size,
                    });
                } else {
                    entries.push({
                        name: p,
                        path: entryPath,
                        isFile: false,
                    });
                }
            } catch {
                // Error is expected so don't print or throw.
                // Windows returns garbage paths that we can't read so just skip them
                // Like "System Volume Information", which exists when using the P:/ drive alias on the repo root
            }
        }
        this.sortFileEntries(entries);

        return { entries, type: Shared.FileListing.SharedProjectListFilesReportTypes.Success };
    },
};
