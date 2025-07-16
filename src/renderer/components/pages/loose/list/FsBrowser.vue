<template>
    <div class="grid grid-rows-[auto_auto_1fr] h-full w-130">
        <div><FsPathField @focus-list="handleFocusList" /></div>
        <USeparator />
        <DataTable
            :columns="columns"
            :entries="entries"
            @on-entry-activated="handleActivated"
            @on-entry-context-menu="handleContextMenu"
            ref="dataTable"
        />
    </div>
</template>

<script setup lang="ts">
import FsPathField from "~/components/pages/loose/list/FsPathField.vue";
import { useLooseFilesStore } from "~/store/LooseFilesStore.js";
import { DataTableColumn } from "~/components/common/DataTable/DataTable.model.js";
import { SharedFsEntry } from "Shared/SharedFileListing.js";
import Humanize from "humanize-plus";
import FsEntryIcon from "~/components/pages/loose/list/FsEntryIcon.vue";
import DataTable from "~/components/common/DataTable/DataTable.vue";

const looseFilesStore = useLooseFilesStore();

const entries = computed(() => looseFilesStore.currentEntries ?? []);

const dataTable = useTemplateRef("dataTable");

const columns: DataTableColumn<SharedFsEntry>[] = [
    {
        id: "icon",
        size: "auto",
        label: "",
        cell: (entry) => h(FsEntryIcon, { entry: entry }),
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

function handleFocusList(): void {
    dataTable.value?.focus();
}

function handleActivated(idx: number): void {
    useLooseFilesStore().onEntryActivated(idx);
}

function handleContextMenu(idx: number): void {
    console.log("Context Menu", idx);
}
</script>

<style scoped></style>
