import chokidar, { FSWatcher } from "chokidar";
import { ConfigSystem } from "./CoreConfigSystem.js";
import path from "path";
import fs from "fs/promises";
import { Logger } from "./CoreLogSystem.js";
import * as Shared from "mod_companion_shared";
import { createWorker, Worker } from "../helpers/CoreWorkerHelper.js";
import { createEvent, Event } from "../helpers/CoreEventHelper.js";

let watcher: FSWatcher | undefined;
let currentPathAbsolute: string | undefined = undefined;
let currentPathRelative: string | undefined = undefined;

const index: Map<string, Shared.FileListing.FileEntry[]> = new Map();

let dirUpdatedNotifyFunc: Shared.FileListing.DirUpdatedNotifyFunc | undefined = undefined;

function _handleIndexMessage(result: { dir: string; entries: Shared.FileListing.FileEntry[] }) {
    index.set(result.dir, result.entries);
    dirUpdatedNotifyFunc?.(result.dir, result.entries);
}

let indexDoneEvent: Event<Map<string, Shared.FileListing.FileEntry[]>> | undefined = undefined;

export const FileBrowserSystem = {
    initSystem(notifyFunc?: Shared.FileListing.DirUpdatedNotifyFunc) {
        dirUpdatedNotifyFunc = notifyFunc;
        this.indexFiles();
        indexDoneEvent = createEvent();

        watcher = chokidar.watch([], { ignoreInitial: true, awaitWriteFinish: true, depth: 0 });

        async function _change(filePath: string) {
            Logger.debug(Shared.Log.Channel.FileBrowser, "File changed", filePath);
            if (!currentPathAbsolute || !currentPathRelative) {
                return;
            }

            const result = await FileBrowserSystem.listFiles(currentPathAbsolute);
            if (result.type !== Shared.FileListing.SharedProjectListFilesReportTypes.Success) {
                return;
            }

            notifyFunc?.(currentPathRelative, result.entries);
        }

        watcher.on("add", _change);
        watcher.on("change", _change);
        watcher.on("unlink", _change);
        return true;
    },
    getIndexDoneEvent() {
        return indexDoneEvent;
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

    getIndex(): Map<string, Shared.FileListing.FileEntry[]> {
        return index;
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
        const entries: Shared.FileListing.FileEntry[] = [];

        for (const p of paths) {
            if (Shared.FileListing.isIgnoredPathName(p)) continue;

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

        return { entries, type: Shared.FileListing.SharedProjectListFilesReportTypes.Success };
    },

    indexFiles() {
        Logger.info(Shared.Log.Channel.FileBrowser, "Indexing files...");
        const timeStart = new Date().getTime();
        const worker = createWorker(Worker.IndexFilesystem, ConfigSystem.getAppConfig().rootPath);
        worker.on("message", _handleIndexMessage);
        worker.on("exit", () => {
            const timeEnd = new Date().getTime();
            const totalEntries = index.values().reduce((sum, a) => sum + a.length, 0);
            Logger.info(
                Shared.Log.Channel.FileBrowser,
                "Indexing done. Found",
                totalEntries,
                "entries in",
                index.size,
                "directories. Took",
                timeEnd - timeStart,
                "ms",
            );
            indexDoneEvent?.call(index);
        });
    },
};
