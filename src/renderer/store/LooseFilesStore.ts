import { SharedFsEntry } from "Shared/SharedFileListing.js";
import { defineStore } from "pinia";

export const useLooseFilesStore = defineStore("loose-files", () => {
    const currentDir = ref("");
    const fsEntries = reactive(new Map<string, SharedFsEntry[]>());
    const currentEntries = computed(() => fsEntries.get(currentDir.value));
    const primarySelectedPath = ref<string | undefined>();
    const selectedPaths = ref<string[]>([]);

    watch(currentDir, refreshDir);

    async function refreshDir(dirName: string) {
        const entries = await window.electronAPI.project.listFiles(dirName);
        fsEntries.set(dirName, entries);
        primarySelectedPath.value = undefined;
        selectedPaths.value = [];
    }

    async function updateCurrentDir(dir: string): Promise<void> {
        const correctedPath = await window.electronAPI.project.correctPath(dir);
        if (correctedPath === undefined) {
            console.warn(`Cannot update path to ${dir} because it's invalid`);
            return;
        }

        currentDir.value = correctedPath;
    }

    refreshDir(currentDir.value);

    function startSelect(path: string): void {
        if (!currentEntries.value?.some((e) => e.path === path)) return;

        selectedPaths.value = [path];
        primarySelectedPath.value = path;
    }

    function endSelect(path: string): void {
        if (!primarySelectedPath) return;
        const entries = currentEntries.value;
        if (entries === undefined) return;

        const startIndex = entries.findIndex((e) => e.path === primarySelectedPath.value);
        if (startIndex === -1) return;
        const endIndex = entries.findIndex((e) => e.path === path);
        if (endIndex === -1) return;

        let start = startIndex < endIndex ? startIndex : endIndex;
        let end = startIndex > endIndex ? startIndex : endIndex;
        const selEntries = entries.slice(start, end + 1);
        const selPaths = selEntries.map((e) => e.path);

        selectedPaths.value = selPaths;
        primarySelectedPath.value = path;
    }

    function toggleSelect(path: string): void {
        const indx = selectedPaths.value.findIndex((p) => p === path);

        const selPathsCopy = [...selectedPaths.value];
        if (indx === -1) {
            selPathsCopy.push(path);
            primarySelectedPath.value = path;
        } else {
            selPathsCopy.splice(indx, 1);
        }

        selectedPaths.value = selPathsCopy;
    }

    return {
        currentDir,
        fsEntries,
        refreshDir,
        currentEntries,
        updateCurrentDir,
        selectedPaths,
        primarySelectedPath,
        startSelect,
        endSelect,
        toggleSelect,
    };
});
