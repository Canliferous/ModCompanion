import { defineStore } from "pinia";
import { getRootRelativePath } from "~/helper/SourceFs.js";
import pathe from "pathe";
import { useRememberWorkspaceRef } from "~/composables/useRemember.js";
import { Logger } from "~/logger.js";
import { getAppConfig } from "~/renderer-config.js";
import * as Shared from "mod_companion_shared";
import { useFileFilter } from "~/composables/useFilter.js";

export const useFileBrowserStore = defineStore("file-browser", () => {
    const currentDir = useRememberWorkspaceRef(ref(""), "file-browser-dir");
    const fsEntries = reactive(new Map<string, Shared.FileBrowser.FileEntry[]>());
    const currentEntries = computed(() => fsEntries.get(currentDir.value));
    const activeEntry = ref<Shared.FileBrowser.FileEntry | undefined>(undefined);
    const searchTerm = ref("");
    const searchEntries = useFileFilter(fsEntries, searchTerm, 1000);
    const entriesToShow = computed(() => {
        const entries = searchTerm.value.length > 0 ? searchEntries.value : (currentEntries.value ?? []);
        const { millis, result } = Shared.FileBrowser.sortFileEntries(entries);
        // Logger.debug(Shared.Log.Channel.FileBrowser, "Sorting file entries took", millis, "ms");
        return result;
    });

    watch(currentDir, refreshDir);

    async function refreshDir(dirName: string) {
        const report = await window.electronAPI.fileBrowser.listFiles(dirName);
        window.electronAPI.fileBrowser.setCurrentPath(dirName);

        if (report.type === Shared.FileBrowser.SharedProjectListFilesReportTypes.Success) {
            fsEntries.set(dirName, report.entries);
        }
    }

    function refresh() {
        refreshDir(currentDir.value);
    }

    window.electronAPI.fileBrowser.subscribeDirUpdated((dir, entries) => {
        fsEntries.set(dir, entries);
    });

    window.electronAPI.fileBrowser.subscribeIndexUpdated((index) => {
        fsEntries.clear();
        for (const [key, entries] of index.entries()) {
            fsEntries.set(key, entries);
        }
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

    function onEntryActivated(entry: Shared.FileBrowser.FileEntry): void {
        if (entry.isFile) {
            const fullPath = pathe.join(getAppConfig().rootPath, entry.path);
            window.electronAPI.fileBrowser.open(fullPath);
        } else {
            updateCurrentDir(entry.path);
        }
    }

    return {
        currentDir,
        fsEntries,
        refresh,
        searchTerm,
        searchEntries,
        activeEntry,
        currentEntries,
        entriesToShow,
        updateCurrentDir,
        onEntryActivated,
    };
});
