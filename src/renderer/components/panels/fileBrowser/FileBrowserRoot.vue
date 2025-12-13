<template>
    <MPanelRoot alwaysShowScroll>
        <template #header>
            <FileBrowserLocationBar @focus-list="handleFocusList" />
        </template>
        <UContextMenu :items="items">
            <MDataTable
                :columns="columns"
                :entries="entries"
                @onEntryActivated="handleActivated"
                @onSelectionChanged="handleSelectionChanged"
                @onActiveChanged="handleActiveChanged"
                @onDragStart="handleDragStart"
                ref="dataTable"
                :draggable="true"
                noScroll
            />
        </UContextMenu>
    </MPanelRoot>
</template>

<script setup lang="ts">
import FileBrowserLocationBar from "~/components/panels/fileBrowser/FileBrowserLocationBar.vue";
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";
import { DataTableColumn } from "~/components/common/dataTable/MDataTable.model.js";
import { SharedProjectFileEntry } from "Shared/SharedFileListing.js";
import Humanize from "humanize-plus";
import FileBrowserEntryIcon from "~/components/panels/fileBrowser/FileBrowserEntryIcon.vue";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import pathe from "pathe";
import { SharedAssetDefinitionFileExtension } from "Shared/SharedAssetDefinition.js";
import { AppDesign } from "~/design/AppDesign.js";

const fileBrowserStore = useFileBrowserStore();
const assetListStore = useAssetListStore();

const entries = computed(() => fileBrowserStore.currentEntries ?? []);

const selectedEntries = ref<SharedProjectFileEntry[]>([]);
const activeEntry = ref<SharedProjectFileEntry>();

watch(entries, () => {
    dataTable.value?.deselect();
});

const dataTable = useTemplateRef("dataTable");

const columns: DataTableColumn<SharedProjectFileEntry>[] = [
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
        cell: (entry) => h("span", entry.name),
    },
    {
        id: "size",
        size: "auto",
        label: "Size",
        cell: (entry) =>
            h(
                "span",
                { class: "text-right tabular-nums" },
                entry.fileSize ? Humanize.fileSize(Math.max(entry.fileSize, 1024)) : "",
            ),
    },
];

const items = computed<ContextMenuItem[][]>(() => {
    const entries = selectedEntries.value;
    if (entries.length === 0) return [];

    const allFiles = !entries.some((e) => !e.isFile);
    const pathsArray = entries.map((e) => e.path);

    const mcaFiles = entries.filter((e) => e.isFile && pathe.extname(e.path) === SharedAssetDefinitionFileExtension);

    return [
        [
            {
                label: "Open / Run",
                icon: allFiles ? AppDesign.Icons.ActionLaunchFile : "nothing",
                disabled: !allFiles,
                onSelect(e: Event) {
                    window.electronAPI.fileBrowser.launchFile(pathsArray);
                },
            },
        ],
        [
            {
                label: "Create Asset(s)",
                icon: AppDesign.Icons.ActionCreateAsset,
                disabled: !allFiles,
                onSelect(e) {
                    const primaryPath = activeEntry.value?.path ?? pathsArray[0];
                    const otherPaths = pathsArray.toSpliced(pathsArray.indexOf(primaryPath), 1);
                    assetListStore.createAsset(primaryPath, otherPaths);
                },
            },
            {
                label: "Select Asset in Browser",
                icon: AppDesign.Icons.Asset,
                disabled: mcaFiles.length === 0,
                onSelect(e: Event) {
                    assetListStore.selectByMca(mcaFiles.map((m) => m.path));
                },
            },
        ],
    ] satisfies ContextMenuItem[][];
});

function handleFocusList(): void {
    dataTable.value?.focus();
}

function handleActivated(active: SharedProjectFileEntry): void {
    fileBrowserStore.onEntryActivated(active);
}

function handleSelectionChanged(entries: SharedProjectFileEntry[]): void {
    selectedEntries.value = entries;
}

function handleActiveChanged(entry: SharedProjectFileEntry | undefined): void {
    activeEntry.value = entry;
}

function handleDragStart(
    event: DragEvent,
    primaryEntry: SharedProjectFileEntry,
    allEntries: SharedProjectFileEntry[],
): void {
    const payload = allEntries.map((e) => e.path).join("\n");
    event.dataTransfer?.setData("text/plain", payload);
}
</script>

<style scoped></style>
