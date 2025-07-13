<template>
    <div class="grid grid-rows-[auto_auto_1fr] h-full w-130">
        <div><FsPathField /></div>
        <USeparator />
        <DataTable :columns="columns" :entries="looseFilesStore.currentEntries ?? []" />
    </div>
</template>

<script setup lang="ts">
import FsPathField from "~/components/pages/loose/list/FsPathField.vue";
import { useLooseFilesStore } from "~/store/LooseFilesStore.js";
import { DataTableColumn } from "~/components/common/DataTable/DataTable.model.js";
import { SharedFsEntry } from "Shared/SharedFileListing.js";
import Humanize from "humanize-plus";
const looseFilesStore = useLooseFilesStore();

const columns: DataTableColumn<SharedFsEntry>[] = [
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
        cell: (entry) => h("span", entry.fileSize ? Humanize.fileSize(Math.max(entry.fileSize, 1024)) : ""),
    },
];
</script>

<style scoped></style>
