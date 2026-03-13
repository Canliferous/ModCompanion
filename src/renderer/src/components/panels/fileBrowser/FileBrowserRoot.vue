<template>
    <MPanelRoot no-scroll>
        <template #header>
            <div class="grid gap-1 grid-cols-[1fr_minmax(4rem,30%)]">
                <FileBrowserLocationBar @focus-list="handleFocusList" />
                <FileBrowserSearchBar />
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

const fileBrowserStore = useFileBrowserStore();
const assetListStore = useAssetListStore();
const assetGroupsStore = useAssetGroupsStore();

const entries = computed(() =>
    fileBrowserStore.searchTerm.length > 0 ? fileBrowserStore.searchEntries : (fileBrowserStore.currentEntries ?? []),
);

const selectedEntries = ref<Shared.FileListing.FileEntry[]>([]);

watch(entries, () => {
    dataTable.value?.deselect();
});

const dataTable = useTemplateRef("dataTable");

const columns: DataTableColumn<Shared.FileListing.FileEntry>[] = [
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
                { class: "text-right tabular-nums whitespace-nowrap" },
                entry.fileSize ? Humanize.fileSize(Math.max(entry.fileSize, 1024)) : "",
            ),
    },
];

const items = computed<ContextMenuItem[][]>(() => {
    const entries = selectedEntries.value;
    if (entries.length === 0) {
        return [
            [
                {
                    label: "New Empty Asset",
                    icon: AppDesign.Icons.ActionAdd,
                    onSelect() {
                        window.electronAPI.asset.createEmpty(fileBrowserStore.currentDir);
                    },
                },
            ],
        ] satisfies ContextMenuItem[][];
    }

    const allFiles = !entries.some((e) => !e.isFile);
    const pathsArray = entries.map((e) => e.path);

    const mcaFiles = entries.filter((e) => e.isFile && pathe.extname(e.path) === Shared.Asset.McaFileExt);

    return [
        [
            {
                label: "Open",
                icon: AppDesign.Icons.ActionLaunchFile,
                disabled: !allFiles,
                onSelect() {
                    const fullPaths = pathsArray.map((p) => pathe.join(getAppConfig().rootPath, p));
                    window.electronAPI.fileBrowser.openFile(fullPaths);
                },
            },
            {
                label: "Explore to",
                icon: AppDesign.Icons.ActionBrowseToFolder,
                disabled: entries.length !== 1,
                onSelect() {
                    window.electronAPI.fileBrowser.browseToFile(entries[0].path);
                },
            },
        ],
        [
            {
                label: "Create individual Assets",
                icon: AppDesign.Icons.ActionCreateAsset,
                disabled: !allFiles,
                onSelect() {
                    const primaryPath = fileBrowserStore.activeEntry?.path ?? pathsArray[0];
                    const otherPaths = pathsArray.toSpliced(pathsArray.indexOf(primaryPath), 1);
                    assetListStore.createAsset(primaryPath, otherPaths);
                },
            },
            {
                label: "Create grouped Asset",
                icon: AppDesign.Icons.ActionCreateAsset,
                disabled: !allFiles,
                onSelect() {
                    const primaryPath = fileBrowserStore.activeEntry?.path ?? pathsArray[0];
                    const otherPaths = pathsArray.toSpliced(pathsArray.indexOf(primaryPath), 1);
                    assetListStore
                        .createAsset(primaryPath, otherPaths)
                        .then((assets) => assetGroupsStore.createGroup(assets.map((s) => s.def.id)));
                },
            },
            {
                label: "Select Asset in Browser",
                icon: AppDesign.Icons.Asset,
                disabled: mcaFiles.length === 0,
                onSelect() {
                    assetListStore.selectByMca(mcaFiles.map((m) => m.path));
                },
            },
        ],
        [
            {
                label: "Copy relative path",
                icon: AppDesign.Icons.Copy,
                disabled: entries.length !== 1,
                onSelect(e: Event) {
                    clipboardHelper.writeTextAndToast(entries[0].path);
                },
            },
            {
                label: "Copy full path",
                icon: AppDesign.Icons.Copy,
                disabled: entries.length !== 1,
                onSelect(e: Event) {
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

function handleActivated(active: Shared.FileListing.FileEntry): void {
    fileBrowserStore.onEntryActivated(active);
}

function handleSelectionChanged(entries: Shared.FileListing.FileEntry[]): void {
    selectedEntries.value = entries;
}

function handleActiveChanged(entry: Shared.FileListing.FileEntry | undefined): void {
    fileBrowserStore.activeEntry = entry;
}

function handleDragStart(
    event: DragEvent,
    primaryEntry: Shared.FileListing.FileEntry,
    allEntries: Shared.FileListing.FileEntry[],
): void {
    const payload = allEntries.map((e) => e.path).join("\n");
    event.dataTransfer?.setData("text/plain", payload);
}
</script>

<style scoped></style>
