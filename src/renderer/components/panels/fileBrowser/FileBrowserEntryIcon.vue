<template>
    <UIcon v-if="!entry.isFile" name="tdesign:folder-filled" class="text-yellow-200" />
    <UIcon v-if="entry.isFile" name="tdesign:file-filled" class="text-blue-300" />
</template>

<script setup lang="ts">
import { SharedFsEntry } from "Shared/SharedFileListing.js";

const props = defineProps<{ entry: SharedFsEntry }>();
</script>

<style scoped></style>
