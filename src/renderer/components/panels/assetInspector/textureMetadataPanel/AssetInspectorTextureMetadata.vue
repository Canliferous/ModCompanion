<template>
    <VerticalTable :items="items" />
</template>

<script setup lang="ts">
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { computed } from "vue";
import Humanize from "humanize-plus";
import VerticalTable from "~/components/common/VerticalTable.vue";
import { VerticalTableItem } from "~/components/common/VerticalTable.model.js";

const props = defineProps<{ meta: SharedImageMetaReport }>();

const fileSize = computed(() => {
    if (props.meta?.fileSizeBytes === undefined) return "unknown";
    return Humanize.fileSize(props.meta.fileSizeBytes);
});

const items = computed(() => {
    const itms = [
        { name: "Resolution", value: `${props.meta.width ?? "?"}x${props.meta.height ?? "?"}` },
        { name: "Size", value: fileSize.value },
        { name: "Format", value: props.meta.format },
    ] satisfies VerticalTableItem[];

    if (props.meta.bitDepth) {
        itms.push({ name: "Bit Depth", value: "" + props.meta.bitDepth });
    }
    if (props.meta.colorSpace) {
        itms.push({ name: "Color Space", value: props.meta.colorSpace });
    }

    return itms;
});
</script>

<style scoped></style>
