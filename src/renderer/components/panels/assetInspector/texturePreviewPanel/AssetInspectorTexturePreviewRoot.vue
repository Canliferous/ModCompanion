<template>
    <div class="h-full">
        <MInteractiveImageViewer :src="`file://${meta.filePath}`" />
    </div>
</template>

<script setup lang="ts">
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";

defineProps<{ meta: SharedImageMetaReport }>();
</script>

<style scoped></style>
