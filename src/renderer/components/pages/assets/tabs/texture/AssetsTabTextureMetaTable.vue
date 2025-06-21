<script setup lang="ts">
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { computed } from "vue";
import Humanize from "humanize-plus";

const props = defineProps<{ imageMeta: SharedImageMetaReport }>();

const fileSize = computed(() => {
    if (props.imageMeta?.fileSizeBytes === undefined) return "unknown";
    return Humanize.fileSize(props.imageMeta.fileSizeBytes);
});
</script>

<template>
    <div class="grid grid-cols-[auto,_1fr] content-start">
        <span class="font-bold col-span-2">Metadata</span>
        <span>Resolution</span>
        <span>{{ imageMeta.width ?? "?" }}x{{ imageMeta.height ?? "?" }}</span>
        <span>Size</span>
        <span>{{ fileSize }}</span>
        <span>Format</span>
        <span>{{ imageMeta.format }}</span>
        <span v-if="imageMeta.bitDepth">Bit Depth</span>
        <span v-if="imageMeta.bitDepth">{{ imageMeta.bitDepth }}</span>
        <span>Color Space</span>
        <span>{{ imageMeta.colorSpace }}</span>
    </div>
</template>

<style scoped></style>
