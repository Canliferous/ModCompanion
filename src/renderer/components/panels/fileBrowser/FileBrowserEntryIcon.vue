<template>
    <UIcon v-if="!entry.isFile" :name="AppDesign.Icons.FsFolder" class="text-yellow-200" />
    <UIcon v-if="entry.isFile" :name="AppDesign.Icons.FsFile" class="text-blue-300" />
</template>

<script setup lang="ts">
import { SharedFsEntry } from "Shared/SharedFileListing.js";
import { AppDesign } from "~/design/AppDesign.js";

const props = defineProps<{ entry: SharedFsEntry }>();
</script>

<style scoped></style>
