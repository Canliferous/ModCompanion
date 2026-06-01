<template>
    <span class="text-right font-mono whitespace-nowrap text-muted">
        {{ size ? Humanize.fileSize(Math.max(size, 1024)) : "" }}
    </span>
</template>

<script setup lang="ts">
import Humanize from "humanize-plus";

defineProps<{ size: number | undefined }>();
</script>

<style scoped></style>
