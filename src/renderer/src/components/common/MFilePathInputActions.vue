<template>
    <UButton :icon="AppDesign.Icons.ActionBrowseToFolder" size="sm" variant="link" @click="handleBrowse" />
    <UButton :icon="AppDesign.Icons.ActionLaunchFile" size="sm" variant="link" class="mr-1" @click="handleLaunch" />
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";

const props = defineProps<{ path: string }>();

function handleBrowse(): void {
    window.electronAPI.fileBrowser.browseToFile(props.path);
}

function handleLaunch(): void {
    window.electronAPI.fileBrowser.open(props.path);
}
</script>

<style scoped></style>
