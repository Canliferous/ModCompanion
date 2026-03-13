import { defineStore } from "pinia";
import { getRootRelativePath } from "~/helper/SourceFs.js";
import pathe from "pathe";
import { useRememberWorkspaceRef } from "~/composables/useRemember.js";
import { Logger } from "~/logger.js";
import { getAppConfig } from "~/renderer-config.js";
import * as Shared from "mod_companion_shared";

export const useFileBrowserStore = defineStore("file-browser", () => {
    const currentDir = useRememberWorkspaceRef(ref(""), "file-browser-dir");
    const fsEntries = reactive(new Map<string, Shared.FileListing.FileEntry[]>());
    const currentEntries = computed(() => fsEntries.get(currentDir.value));
    const activeEntry = ref<Shared.FileListing.FileEntry | undefined>(undefined);
    const searchTerm = ref("");
    const searchEntries = ref<Shared.FileListing.FileEntry[]>([]);

    watch(currentDir, refreshDir);

    async function refreshDir(dirName: string) {
        const report = await window.electronAPI.fileBrowser.listFiles(dirName);
        window.electronAPI.fileBrowser.setCurrentPath(dirName);

        if (report.type === Shared.FileListing.SharedProjectListFilesReportTypes.Success) {
            fsEntries.set(dirName, report.entries);
        }
    }

    async function refreshIndex() {
        const result = await window.electronAPI.fileBrowser.indexFiles();
        fsEntries.clear();
        for (const [k, v] of result.index.entries()) {
            fsEntries.set(k, v);
        }
    }

    window.electronAPI.fileBrowser.subscribeDirUpdated((report) => {
        fsEntries.set(report.dir, report.entries);
    });

    function updateCurrentDir(dir: string): void {
        let correctedPath = getRootRelativePath(dir);
        if (correctedPath === undefined) {
            Logger.warning(Shared.Log.Channel.Generic, `Cannot update path to ${dir} because it's invalid`);
            return;
        }

        if (correctedPath.startsWith("/")) {
            correctedPath = correctedPath.substring(1);
        }
        if (pathe.extname(correctedPath) !== "") {
            correctedPath = pathe.dirname(correctedPath);
        }

        currentDir.value = correctedPath;
    }

    function onEntryActivated(entry: Shared.FileListing.FileEntry): void {
        if (entry.isFile) {
            const fullPath = pathe.join(getAppConfig().rootPath, entry.path);
            window.electronAPI.fileBrowser.openFile(fullPath);
        } else {
            updateCurrentDir(entry.path);
        }
    }

    watch(searchTerm, (newVal) => updateSearch(newVal));

    function updateSearch(searchTerm: string): void {
        const result: Shared.FileListing.FileEntry[] = [];

        const MAX_RESULTS = 1000;
        let resultsCount = 0;

        const searchTerms = searchTerm.split(" ");
        const { millis } = Shared.Timing.timeMillis(() => {
            loop1: for (const entry of fsEntries.values()) {
                for (const e of entry) {
                    let match = true;
                    for (const term of searchTerms) {
                        if (!e.name.includes(term)) {
                            match = false;
                        }
                    }

                    if (match) {
                        if (resultsCount++ > MAX_RESULTS) break loop1;
                        result.push(e);
                    }
                }
            }
        });

        result.sort((a, b) => a.name.localeCompare(b.name));

        Logger.debug(Shared.Log.Channel.FileBrowser, "Searching took", millis, "ms");

        searchEntries.value = result;
    }

    refreshDir(currentDir.value);
    refreshIndex();

    return {
        currentDir,
        fsEntries,
        refreshDir,
        searchTerm,
        searchEntries,
        activeEntry,
        currentEntries,
        updateCurrentDir,
        onEntryActivated,
    };
});
