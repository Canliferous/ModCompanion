<template>
    <button
        class="grid col-span-full grid-cols-subgrid items-center gap-x-2 px-2 text-left cursor-pointer text-sm hover:bg-accented outline-none"
        :class="{ 'bg-primary-500/40': isPrimarySelected, 'bg-primary-500/20 hover:bg-primary-500/50': isSelected }"
        @click="handleClick"
        @contextmenu="handleClick"
        @dblclick="handleDoubleClick"
    >
        <div>
            <FsEntryIcon :entry="entry" />
        </div>
        <div class="tracking-wide">
            {{ entry.name }}
        </div>
        <div class="flex justify-end">
            <span class="text-neutral-400 whitespace-nowrap" v-if="entry.fileSize">
                {{ fileSize(Math.max(entry.fileSize, 1024)) }}
            </span>
        </div>
    </button>
</template>

<script setup lang="ts">
import { SharedFsEntry } from "Shared/SharedFileListing.js";
import { useLooseFilesStore } from "~/store/LooseFilesStore.js";
import { fileSize } from "humanize-plus";
import FsEntryIcon from "~/components/pages/loose/list/FsEntryIcon.vue";

const props = defineProps<{ entry: SharedFsEntry }>();

const isSelected = computed(() => useLooseFilesStore().selectedPaths.includes(props.entry.path));
const isPrimarySelected = computed(() => useLooseFilesStore().primarySelectedPath === props.entry.path);

function handleClick(event: MouseEvent): void {
    const shift = event.shiftKey;
    const control = event.ctrlKey;

    if (!shift) {
        if (control) {
            useLooseFilesStore().toggleSelect(props.entry.path);
        } else {
            useLooseFilesStore().startSelect(props.entry.path);
        }
    } else {
        useLooseFilesStore().endSelect(props.entry.path);
    }
}

function handleDoubleClick(event: MouseEvent): void {
    if (!props.entry.isFile) {
        useLooseFilesStore().currentDir = props.entry.path;
    } else {
        window.electronAPI.project.launchFile(props.entry.path);
    }
}
</script>

<style scoped></style>
