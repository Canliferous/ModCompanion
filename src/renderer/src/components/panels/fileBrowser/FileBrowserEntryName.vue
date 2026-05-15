<template>
    <span class="text-ellipsis overflow-clip">{{ entry.name }}</span>
</template>

<script setup lang="ts">
import * as Shared from "mod_companion_shared";
defineProps<{ entry: Shared.FileBrowser.FileEntry }>();
</script>

<style scoped></style>
