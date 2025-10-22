import { SharedProjectFileEntry, SharedProjectListFilesReportTypes } from "Shared/SharedFileListing.js";
import { defineStore } from "pinia";
import { getRootRelativePath } from "~/helper/SourceFs.js";
import pathe from "pathe";
import { useRememberRef, useRememberWorkspaceRef } from "~/composables/useRemember.js";

export const useFileBrowserStore = defineStore("file-browser", () => {
    const currentDir = useRememberWorkspaceRef(ref(""), "file-browser-dir");
    const fsEntries = reactive(new Map<string, SharedProjectFileEntry[]>());
    const currentEntries = computed(() => fsEntries.get(currentDir.value));

    watch(currentDir, refreshDir);

    async function refreshDir(dirName: string) {
        const report = await window.electronAPI.project.listFiles(dirName);

        if (report.type === SharedProjectListFilesReportTypes.Success) {
            fsEntries.set(dirName, report.entries);
        }
    }

    function updateCurrentDir(dir: string): void {
        let correctedPath = getRootRelativePath(dir);
        if (correctedPath === undefined) {
            console.warn(`Cannot update path to ${dir} because it's invalid`);
            return;
        }

        if (pathe.extname(correctedPath) !== "") {
            correctedPath = pathe.dirname(correctedPath);
        }
        currentDir.value = correctedPath;
    }

    function onEntryActivated(entry: SharedProjectFileEntry): void {
        if (entry.isFile) {
            window.electronAPI.project.launchFile(entry.path);
        } else {
            updateCurrentDir(entry.path);
        }
    }

    refreshDir(currentDir.value);

    return {
        currentDir,
        fsEntries,
        refreshDir,
        currentEntries,
        updateCurrentDir,
        onEntryActivated,
    };
});
