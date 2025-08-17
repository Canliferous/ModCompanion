<template>
    <div class="flex items-center select-none">
        <UButton size="sm" color="neutral" variant="ghost" icon="tdesign:home-filled" @click="handleHomeClick" />
        <template v-for="(split, index) in pathSplits">
            <span class="text-xs">/</span>
            <UButton
                :label="split"
                size="sm"
                color="neutral"
                variant="ghost"
                class="px-1"
                @click="(event: MouseEvent) => handleClick(event, index + 1)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";

const looseFilesStore = useFileBrowserStore();
const pathSplits = computed(() => looseFilesStore.currentDir.split("/"));

function handleClick(event: MouseEvent, index: number): void {
    event.stopPropagation();
    let fullPath = "";
    for (let i = 0; i < index; i++) {
        if (i > 0) fullPath += "/";
        fullPath += pathSplits.value[i];
    }

    looseFilesStore.currentDir = fullPath;
}

function handleHomeClick(event: MouseEvent): void {
    event.stopPropagation();
    looseFilesStore.currentDir = "";
}
</script>

<style scoped></style>
