<script setup lang="ts">
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { computed } from "vue";
import Humanize from "humanize-plus";
import VerticalTable from "~/components/common/VerticalTable.vue";
import { VerticalTableItem } from "~/components/common/VerticalTable.model.js";

const props = defineProps<{ imageMeta: SharedImageMetaReport }>();

const fileSize = computed(() => {
    if (props.imageMeta?.fileSizeBytes === undefined) return "unknown";
    return Humanize.fileSize(props.imageMeta.fileSizeBytes);
});

const items = computed(() => {
    const itms = [
        { name: "Resolution", value: `${props.imageMeta.width ?? "?"}x${props.imageMeta.height ?? "?"}` },
        { name: "Size", value: fileSize.value },
        { name: "Format", value: props.imageMeta.format },
    ] satisfies VerticalTableItem[];

    if (props.imageMeta.bitDepth) {
        itms.push({ name: "Bit Depth", value: "" + props.imageMeta.bitDepth });
    }
    if (props.imageMeta.colorSpace) {
        itms.push({ name: "Color Space", value: props.imageMeta.colorSpace });
    }

    return itms;
});
</script>

<template>
    <VerticalTable :items="items" />
</template>

<style scoped></style>
