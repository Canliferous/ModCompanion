<template>
    <UIcon v-if="!entry.isFile" :name="AppDesign.Icons.FsFolder" class="text-yellow-200" />
    <UIcon v-if="entry.isFile" :name="getFileTypeIcon(getFileType(entry.path))" class="text-blue-300" />
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";
import { getFileType, getFileTypeIcon } from "~/helper/FileInspectorHelper.js";

defineProps<{ entry: Shared.FileBrowser.FileEntry }>();
</script>

<style scoped></style>
