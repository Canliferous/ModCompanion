import chokidar, { FSWatcher } from "chokidar";
import { ConfigSystem } from "./CoreConfigSystem.js";
import path from "path";
import fs from "fs/promises";
import { Logger } from "./CoreLogSystem.js";
import * as Shared from "mod_companion_shared";
import { createWorker, Worker } from "../helpers/CoreWorkerHelper.js";
import { createEvent, Event } from "../helpers/CoreEventHelper.js";

let watcher: FSWatcher | undefined;

const index: Map<string, Shared.FileBrowser.FileEntry[]> = new Map();

let dirUpdatedNotifyFunc: Shared.FileBrowser.DirUpdatedNotifyFunc | undefined = undefined;

function _handleIndexMessage(result: { dir: string; entries: Shared.FileBrowser.FileEntry[] }) {
    index.set(result.dir, result.entries);
    dirUpdatedNotifyFunc?.(result.dir, { entries: result.entries, valid: true });
}

let indexDoneEvent: Event<Map<string, Shared.FileBrowser.FileEntry[]>> | undefined = undefined;

export const FileBrowserSystem = {
    initSystem(notifyFunc?: Shared.FileBrowser.DirUpdatedNotifyFunc) {
        dirUpdatedNotifyFunc = notifyFunc;
        this.indexFiles();
        indexDoneEvent = createEvent();
        return true;
    },

    getIndexDoneEvent() {
        return indexDoneEvent;
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

    async updateOpenedDirs(dirs: string[]) {
        return _recreateWatcher(dirs);
    },

    getIndex(): Map<string, Shared.FileBrowser.FileEntry[]> {
        return index;
    },

    async listFiles(dirPath: string, resultBaseRoot?: string): Promise<Shared.FileBrowser.FileEntries> {
        if (!this.isProjectPath(dirPath)) return { valid: false, entries: [] };

        let paths: string[] = [];
        try {
            paths = await fs.readdir(dirPath);
        } catch (e) {
            return { valid: false, entries: [] };
        }
        const entries: Shared.FileBrowser.FileEntry[] = [];

        for (const p of paths) {
            if (Shared.FileBrowser.isIgnoredPathName(p)) continue;

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

        return { entries, valid: true };
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

async function _change(filePath: string): Promise<void> {
    Logger.info(Shared.Log.Channel.FileBrowser, "CHANGE", filePath);
    const dir = path.dirname(filePath);

    const result = await FileBrowserSystem.listFiles(dir);

    let finalDir = dir.substring(ConfigSystem.getAppConfig().rootPath.length);
    if (!finalDir) {
        finalDir = "/";
    }
    dirUpdatedNotifyFunc?.(finalDir, result);
}

async function _delete(filePath: string): Promise<void> {
    Logger.info(Shared.Log.Channel.FileBrowser, "DELETED", filePath);
}

async function _add(filePath: string): Promise<void> {
    Logger.info(Shared.Log.Channel.FileBrowser, "ADDED", filePath);
}

async function _recreateWatcher(dirs: string[]) {
    if (watcher) {
        await watcher.close();
    }

    const rootPath = ConfigSystem.getAppConfig().rootPath;
    const fullDirs = dirs.map((d) => path.join(rootPath, d));

    Logger.info(Shared.Log.Channel.FileBrowser, "Watching", fullDirs.join(", "));

    watcher = chokidar.watch(fullDirs, {
        ignoreInitial: true,
        awaitWriteFinish: true,
        depth: 0,
    });

    watcher.on("add", _add);
    watcher.on("change", _change);
    watcher.on("unlink", _delete);
}
