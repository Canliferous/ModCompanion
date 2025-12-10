<template>
    <div class="flex items-center select-none gap-0.5 overflow-x-auto">
        <UButton
            size="sm"
            color="neutral"
            variant="ghost"
            class="text-muted"
            :icon="AppDesign.Icons.Home"
            @click="handleHomeClick"
        />
        <template v-for="(split, index) in pathSplits">
            <span class="text-xs text-muted">/</span>
            <UButton
                :label="split"
                size="sm"
                color="neutral"
                variant="ghost"
                class="px-0 text-muted"
                @click="(event: MouseEvent) => handleClick(event, index + 1)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";
import { AppDesign } from "~/design/AppDesign.js";

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
