<template>
    <div class="flex items-center select-none">
        <UButton size="sm" color="neutral" variant="ghost" icon="tdesign:home-filled" @click="handleHomeClick()" />
        <template v-for="(split, index) in pathSplits">
            <UButton
                :label="split"
                size="sm"
                color="neutral"
                variant="ghost"
                class="px-1"
                @click="handleClick(index + 1)"
            />
            <span class="text-xs" v-if="index !== pathSplits.length - 1">/</span>
        </template>
    </div>
</template>

<script setup lang="ts">
import { useLooseFilesStore } from "~/store/LooseFilesStore.js";

const looseFilesStore = useLooseFilesStore();
const pathSplits = computed(() => looseFilesStore.currentDir.split("/"));

function handleClick(index: number): void {
    let fullPath = "";
    for (let i = 0; i < index; i++) {
        if (i > 0) fullPath += "/";
        fullPath += pathSplits.value[i];
    }

    looseFilesStore.currentDir = fullPath;
}

function handleHomeClick(): void {
    looseFilesStore.currentDir = "";
}
</script>

<style scoped></style>
