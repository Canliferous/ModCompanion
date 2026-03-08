<template>
    <UIcon v-if="!entry.isFile" :name="AppDesign.Icons.FsFolder" class="text-yellow-200" />
    <UIcon v-if="entry.isFile" :name="AppDesign.Icons.FsFile" class="text-blue-300" />
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";

defineProps<{ entry: Shared.FileListing.FileEntry }>();
</script>

<style scoped></style>
