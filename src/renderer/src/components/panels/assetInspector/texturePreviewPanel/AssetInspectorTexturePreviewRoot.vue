<template>
    <div class="h-full">
        <MInteractiveImageViewer :src="`file://${meta.filePath}`" />
    </div>
</template>

<script setup lang="ts">
import * as Shared from "mod_companion_shared";

defineProps<{ meta: Shared.ImageMeta.ImageMetaReport }>();
</script>

<style scoped></style>
