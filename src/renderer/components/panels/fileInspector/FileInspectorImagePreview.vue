<template>
    <div>
        <img v-if="imgData && imgData.data" :src="base64ImageUrl(imgData.data)" />
    </div>
</template>

<script setup lang="ts">
import { base64ImageUrl } from "~/helper/ImageHelper.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { getAppConfig } from "~/renderer-config.js";
import pathe from "pathe";

const props = defineProps<{ path: string }>();

const imgData = ref<SharedImageMetaReport | undefined>();

watch(
    () => props.path,
    () => fetchImage(props.path),
);
async function fetchImage(path: string) {
    const p = pathe.join(getAppConfig().rootPath, path);
    const result = await window.electronAPI.image.getMeta(p);
    imgData.value = result;
}
fetchImage(props.path);
</script>

<style scoped></style>
