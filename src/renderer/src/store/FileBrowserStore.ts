import { defineStore } from "pinia";
import { getRootRelativePath } from "~/helper/SourceFs.js";
import pathe from "pathe";
import { useRememberWorkspaceRef } from "~/composables/useRemember.js";
import { Logger } from "~/logger.js";
import { getAppConfig } from "~/renderer-config.js";
import * as Shared from "mod_companion_shared"

export const useFileBrowserStore = defineStore("file-browser", () => {
    const currentDir = useRememberWorkspaceRef(ref(""), "file-browser-dir");
    const fsEntries = reactive(new Map<string, Shared.FileListing.FileEntry[]>());
    const currentEntries = computed(() => fsEntries.get(currentDir.value));
    const activeEntry = ref<Shared.FileListing.FileEntry | undefined>(undefined);

    watch(currentDir, refreshDir);

    async function refreshDir(dirName: string) {
        const report = await window.electronAPI.fileBrowser.listFiles(dirName);
        window.electronAPI.fileBrowser.setCurrentPath(dirName);

        if (report.type === Shared.FileListing.SharedProjectListFilesReportTypes.Success) {
            fsEntries.set(dirName, report.entries);
        }
    }

    window.electronAPI.fileBrowser.subscribeDirectoryChanged((report) => {
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

    refreshDir(currentDir.value);

    return {
        currentDir,
        fsEntries,
        refreshDir,
        activeEntry,
        currentEntries,
        updateCurrentDir,
        onEntryActivated,
    };
});
