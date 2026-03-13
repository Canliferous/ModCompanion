<template>
    <UTooltip :text="entry.path" :content="{ align: 'start' }">
        <span>{{ entry.name }}</span>
    </UTooltip>
</template>

<script setup lang="ts">
import * as Shared from "mod_companion_shared";
defineProps<{ entry: Shared.FileListing.FileEntry }>();
</script>

<style scoped></style>
