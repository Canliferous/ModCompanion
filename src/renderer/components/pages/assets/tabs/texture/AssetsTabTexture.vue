<script setup lang="ts">
import { computed } from "vue";
import { SharedAsset } from "Shared/SharedAsset.js";
import { getAppConfig } from "~/renderer-config.js";
import pathe from "pathe";

const props = defineProps<{ asset: SharedAsset }>();
const sourceImageFilePath = computed(() => {
    const srcFile = props.asset.contentFiles[0];
    const fullPath = pathe.join(getAppConfig().contentPath, getAppConfig().gameName, srcFile);
    return `file://${fullPath}`;
});
</script>

<template>
    <img :src="sourceImageFilePath" />
</template>

<style scoped></style>
