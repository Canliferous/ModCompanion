import { defineStore } from "pinia";
import * as Shared from "mod_companion_shared";

export const useFileBrowserStore = defineStore("file-browser", () => {
    const fsEntries = reactive(new Map<string, Shared.FileBrowser.FileEntry[]>());

    async function refreshDir(dirName: string) {
        const report = await window.electronAPI.fileBrowser.listFiles(dirName);
        window.electronAPI.fileBrowser.setCurrentPath(dirName);

        if (report.type === Shared.FileBrowser.SharedProjectListFilesReportTypes.Success) {
            fsEntries.set(dirName, report.entries);
        }
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

    return {
        fsEntries,
        refreshDir,
    };
});
