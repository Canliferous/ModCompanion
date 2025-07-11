<template>
    <button
        class="grid col-span-full grid-cols-subgrid items-center gap-x-2 px-2 not-last:border-b border-b-accented text-left cursor-pointer hover:bg-accented"
        @click="handleClick()"
    >
        <div>
            <UIcon :name="entry.isFile ? 'tdesign:file' : 'tdesign:folder'" />
        </div>
        <div>
            {{ entry.name }}
        </div>
        <div>
            {{ entry.fileSize }}
        </div>
    </button>
</template>

<script setup lang="ts">
import { SharedFsEntry } from "Shared/SharedFileListing.js";
import { useLooseFilesStore } from "~/store/LooseFilesStore.js";

const props = defineProps<{ entry: SharedFsEntry }>();

function handleClick() {
    if (!props.entry.isFile) {
        useLooseFilesStore().currentDir = props.entry.path;
    }
}
</script>

<style scoped></style>
