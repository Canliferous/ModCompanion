import { SharedProjectFileEntry, SharedProjectListFilesReportTypes } from "Shared/SharedFileListing.js";
import { defineStore } from "pinia";
import { getRootRelativePath } from "~/helper/SourceFs.js";
import pathe from "pathe";
import { useRememberWorkspaceRef } from "~/composables/useRemember.js";
import { Logger } from "~/logger.js";
import { SharedLogChannel } from "Shared/SharedLogger.js";
import { getAppConfig } from "~/renderer-config.js";

export const useFileBrowserStore = defineStore("file-browser", () => {
    const currentDir = useRememberWorkspaceRef(ref(""), "file-browser-dir");
    const fsEntries = reactive(new Map<string, SharedProjectFileEntry[]>());
    const currentEntries = computed(() => fsEntries.get(currentDir.value));
    const activeEntry = ref<SharedProjectFileEntry | undefined>(undefined);

    watch(currentDir, refreshDir);

    async function refreshDir(dirName: string) {
        const report = await window.electronAPI.fileBrowser.listFiles(dirName);
        window.electronAPI.fileBrowser.setCurrentPath(dirName);

        if (report.type === SharedProjectListFilesReportTypes.Success) {
            fsEntries.set(dirName, report.entries);
        }
    }

    window.electronAPI.fileBrowser.subscribeDirectoryChanged((report) => {
        fsEntries.set(report.dir, report.entries);
    });

    function updateCurrentDir(dir: string): void {
        let correctedPath = getRootRelativePath(dir);
        if (correctedPath === undefined) {
            Logger.warning(SharedLogChannel.Generic, `Cannot update path to ${dir} because it's invalid`);
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

    function onEntryActivated(entry: SharedProjectFileEntry): void {
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
