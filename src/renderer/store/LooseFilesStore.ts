import { SharedFsEntry } from "Shared/SharedFileListing.js";
import { defineStore } from "pinia";

export const useLooseFilesStore = defineStore("loose-files", () => {
    const currentDir = ref("");
    const fsEntries = reactive(new Map<string, SharedFsEntry[]>());
    const currentEntries = computed(() => fsEntries.get(currentDir.value));

    watch(currentDir, refreshDir);

    async function refreshDir(dirName: string) {
        const entries = await window.electronAPI.project.listFiles(dirName);
        fsEntries.set(dirName, entries);
    }

    async function updateCurrentDir(dir: string): Promise<void> {
        const correctedPath = await window.electronAPI.project.correctPath(dir);
        if (correctedPath === undefined) {
            console.warn(`Cannot update path to ${dir} because it's invalid`);
            return;
        }

        currentDir.value = correctedPath;
    }

    function onEntryActivated(idx: number): void {
        const entries = currentEntries.value;
        if (!entries) return;

        const entry = idx < entries?.length - 1 ? entries[idx] : undefined;
        if (!entry) return;

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
