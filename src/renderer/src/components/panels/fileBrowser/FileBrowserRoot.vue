<template>
    <MPanelRoot no-scroll>
        <template #header>
            <div class="grid gap-1 grid-cols-[1fr_minmax(4rem,30%)]">
                <FileBrowserLocationBar
                    v-model="currentDir"
                    @clear-search="clearSearchTerm"
                    @focus-list="handleFocusList"
                />
                <FileBrowserSearchBar v-model="searchTerm" />
            </div>
        </template>
        <UContextMenu :items="items">
            <MDataTable
                ref="dataTable"
                :row-height="20"
                :columns="columns"
                :entries="entries"
                :draggable="true"
                no-scroll
                @on-entry-activated="handleActivated"
                @on-selection-changed="handleSelectionChanged"
                @on-active-changed="handleActiveChanged"
                @on-drag-start="handleDragStart"
            />
        </UContextMenu>
    </MPanelRoot>
</template>

<script setup lang="ts">
import Humanize from "humanize-plus";
import pathe from "pathe";
import FileBrowserLocationBar from "~/components/panels/fileBrowser/FileBrowserLocationBar.vue";
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";
import { DataTableColumn } from "~/components/common/dataTable/MDataTable.model.js";
import FileBrowserEntryIcon from "~/components/panels/fileBrowser/FileBrowserEntryIcon.vue";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { AppDesign } from "~/design/AppDesign.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { getAppConfig } from "~/renderer-config.js";
import clipboardHelper from "~/helper/ClipboardHelper.js";
import * as Shared from "mod_companion_shared";
import FileBrowserSearchBar from "~/components/panels/fileBrowser/FileBrowserSearchBar.vue";
import FileBrowserEntryName from "~/components/panels/fileBrowser/FileBrowserEntryName.vue";
import { useFileFilter } from "~/composables/useFilter";
import { getRootRelativePath } from "~/helper/SourceFs";
import { Logger } from "~/logger";
import { AssetInspectorModel } from "~/components/panels/assetInspector/AssetInspector.model.js";
import { GlobalComponentNames } from "~/helper/GlobalComponents.js";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { FileInspectorModel } from "~/components/panels/fileInspector/FileInspector.model.js";

const fileBrowserStore = useFileBrowserStore();
const assetListStore = useAssetListStore();
const assetGroupsStore = useAssetGroupsStore();
const panelsStore = usePanelsStore();

const searchTerm = defineModel<string>("search");
const currentDir = defineModel<string>("dir");

const searchEntries = computed(() => useFileFilter(fileBrowserStore.fsEntries, searchTerm.value, 1000));
const entries: ComputedRef<Shared.FileBrowser.FileEntry[]> = computed(() => {
    let e;
    if (searchTerm.value) {
        e = searchEntries.value;
    } else {
        e = fileBrowserStore.getEntries(currentDir.value);
    }

    return Shared.FileBrowser.sortFileEntries(e);
});

const activeEntry = ref<Shared.FileBrowser.FileEntry | undefined>(undefined);

watch(currentDir, (dir) => {
    return dir ? fileBrowserStore.refreshDir(dir) : undefined;
});

const selectedEntries = ref<Shared.FileBrowser.FileEntry[]>([]);

watch(entries, () => {
    dataTable.value?.deselect();
});

const dataTable = useTemplateRef("dataTable");

const columns: DataTableColumn<Shared.FileBrowser.FileEntry>[] = [
    {
        id: "icon",
        size: "auto",
        label: "",
        cell: (entry) => h(FileBrowserEntryIcon, { entry: entry }),
    },
    {
        id: "name",
        size: "1fr",
        label: "Name",
        cell: (entry) => h(FileBrowserEntryName, { entry: entry }),
    },
    {
        id: "size",
        size: "auto",
        label: "Size",
        cell: (entry) =>
            h(
                "span",
                { class: "text-right font-mono whitespace-nowrap" },
                entry.fileSize ? Humanize.fileSize(Math.max(entry.fileSize, 1024)) : "",
            ),
    },
];

const items = computed<ContextMenuItem[][]>(() => {
    const entries = selectedEntries.value;
    const dir = currentDir.value;
    if (entries.length === 0 && dir) {
        return [
            [
                {
                    label: "New Empty Asset",
                    icon: AppDesign.Icons.ActionAdd,
                    onSelect() {
                        window.electronAPI.asset.createEmpty(dir);
                    },
                },
            ],
        ] satisfies ContextMenuItem[][];
    }

    const allFiles = !entries.some((e) => !e.isFile);
    const pathsArray = entries.map((e) => e.path);

    return [
        [
            {
                label: "Open",
                icon: AppDesign.Icons.ActionLaunchFile,
                disabled: !allFiles,
                onSelect() {
                    const fullPaths = pathsArray.map((p) => pathe.join(getAppConfig().rootPath, p));
                    window.electronAPI.fileBrowser.open(fullPaths);
                },
            },
            {
                label: "Explore to",
                icon: AppDesign.Icons.ActionBrowseToFolder,
                disabled: entries.length !== 1,
                onSelect() {
                    window.electronAPI.fileBrowser.browseToFile(pathe.join(getAppConfig().rootPath, entries[0].path));
                },
            },
            {
                label: "Show directory",
                icon: AppDesign.Icons.ActionBrowseToFolder,
                disabled: entries.length !== 1,
                onSelect() {
                    setCurrentDir(pathe.dirname(entries[0].path));
                },
            },
        ],
        [
            {
                label: "Create individual Assets",
                icon: AppDesign.Icons.ActionCreateAsset,
                disabled: !allFiles,
                onSelect() {
                    const primaryPath = activeEntry.value?.path ?? pathsArray[0];
                    const otherPaths = pathsArray.toSpliced(pathsArray.indexOf(primaryPath), 1);
                    assetListStore.createAsset(primaryPath, otherPaths);
                },
            },
            {
                label: "Create grouped Asset",
                icon: AppDesign.Icons.ActionCreateAsset,
                disabled: !allFiles,
                onSelect() {
                    const primaryPath = activeEntry.value?.path ?? pathsArray[0];
                    const otherPaths = pathsArray.toSpliced(pathsArray.indexOf(primaryPath), 1);
                    assetListStore
                        .createAsset(primaryPath, otherPaths)
                        .then((assets) => assetGroupsStore.createGroup(assets.map((s) => s.def.id)));
                },
            },
        ],
        [
            {
                label: "Copy relative path",
                icon: AppDesign.Icons.Copy,
                disabled: entries.length !== 1,
                onSelect() {
                    clipboardHelper.writeTextAndToast(entries[0].path);
                },
            },
            {
                label: "Copy full path",
                icon: AppDesign.Icons.Copy,
                disabled: entries.length !== 1,
                onSelect() {
                    const fullPath = pathe.join(getAppConfig().rootPath, entries[0].path);
                    clipboardHelper.writeTextAndToast(fullPath);
                },
            },
        ],
    ] satisfies ContextMenuItem[][];
});

function handleFocusList(): void {
    dataTable.value?.focus();
}

function handleActivated(entry: Shared.FileBrowser.FileEntry, event?: KeyboardEvent | MouseEvent): void {
    if (!entry.isFile) {
        setCurrentDir(entry.path);
        return;
    }

    if (event?.shiftKey) {
        const fullPath = pathe.join(getAppConfig().rootPath, entry.path);
        window.electronAPI.fileBrowser.open(fullPath);
    } else {
        panelsStore.spawnPanelAtSimilar<FileInspectorModel>(
            GlobalComponentNames.FileInspector,
            { file: entry.path },
            "right",
        );
    }
}

function handleSelectionChanged(entries: Shared.FileBrowser.FileEntry[]): void {
    selectedEntries.value = entries;
}

function handleActiveChanged(entry: Shared.FileBrowser.FileEntry | undefined): void {
    activeEntry.value = entry;
}

function handleDragStart(
    event: DragEvent,
    primaryEntry: Shared.FileBrowser.FileEntry,
    allEntries: Shared.FileBrowser.FileEntry[],
): void {
    const payload = allEntries.map((e) => e.path).join("\n");
    event.dataTransfer?.setData("text/plain", payload);
}

function setCurrentDir(dir: string): void {
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
    clearSearchTerm();
}

function clearSearchTerm() {
    searchTerm.value = "";
}
</script>

<style scoped></style>
