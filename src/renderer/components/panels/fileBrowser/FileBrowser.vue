<template>
    <div class="grid grid-rows-[auto_auto_minmax(0,_1fr)] h-full w-full">
        <div><FileBrowserLocationBar @focus-list="handleFocusList" /></div>
        <USeparator />
        <UContextMenu :items="items">
            <DataTable
                :columns="columns"
                :entries="entries"
                @onEntryActivated="handleActivated"
                @onSelectionChanged="handleSelectionChanged"
                @onActiveChanged="handleActiveChanged"
                ref="dataTable"
            />
        </UContextMenu>
    </div>
</template>

<script setup lang="ts">
import FileBrowserLocationBar from "~/components/panels/fileBrowser/FileBrowserLocationBar.vue";
import { useLooseFilesStore } from "~/store/LooseFilesStore.js";
import { DataTableColumn } from "~/components/common/DataTable/DataTable.model.js";
import { SharedFsEntry } from "Shared/SharedFileListing.js";
import Humanize from "humanize-plus";
import FileBrowserEntryIcon from "~/components/panels/fileBrowser/FileBrowserEntryIcon.vue";
import DataTable from "~/components/common/DataTable/DataTable.vue";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const looseFilesStore = useLooseFilesStore();
const assetListStore = useAssetListStore();

const entries = computed(() => looseFilesStore.currentEntries ?? []);

const selectedIndexes = ref<number[]>([]);
const activeIndex = ref<number>();

watch(entries, () => {
    dataTable.value?.deselect();
});

const dataTable = useTemplateRef("dataTable");

const columns: DataTableColumn<SharedFsEntry>[] = [
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
                { class: "text-right font-mono" },
                entry.fileSize ? Humanize.fileSize(Math.max(entry.fileSize, 1024)) : "",
            ),
    },
];

const activeEntry = computed(() => {
    const index = activeIndex.value;
    if (index === undefined || index < 0) return undefined;
    const etr = entries.value;
    if (index > etr.length - 1) return undefined;
    return etr[index];
});

const selectedEntries = computed(() => {
    const idxs = selectedIndexes.value;
    const result: SharedFsEntry[] = [];
    const entries1 = entries.value;
    for (let i = 0; i < entries1.length; i++) {
        if (idxs.includes(i)) {
            result.push(entries1[i]);
        }
    }

    return result;
});

const items = computed<ContextMenuItem[][]>(() => {
    const entries = selectedEntries.value;
    if (entries.length === 0) return [];

    const allFiles = !entries.some((e) => !e.isFile);
    const pathsArray = entries.map((e) => e.path);

    return [
        [
            {
                label: "Open / Run",
                icon: "tdesign:arrow-right",
                disabled: !allFiles,
                onSelect(e: Event) {
                    window.electronAPI.project.launchFile(pathsArray);
                },
            },
        ],
        [
            {
                label: "Create Asset",
                icon: "tdesign:plus",
                disabled: !allFiles,
                onSelect(e) {
                    assetListStore.createAsset(pathsArray);
                },
            },
        ],
    ] satisfies ContextMenuItem[][];
});

function handleFocusList(): void {
    dataTable.value?.focus();
}

function handleActivated(idx: number): void {
    looseFilesStore.onEntryActivated(idx);
}

function handleSelectionChanged(idxs: number[]): void {
    selectedIndexes.value = idxs;
}

function handleActiveChanged(idx: number | undefined): void {
    activeIndex.value = idx;
}
</script>

<style scoped></style>
