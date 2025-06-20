<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { SharedAsset } from "Shared/SharedAsset.js";
import { getAppConfig } from "~/renderer-config.js";
import pathe from "pathe";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";

const props = defineProps<{ asset: SharedAsset }>();
const sourceImageFilePath = computed(() => {
    if (props.asset.contentFiles.length === 0) {
        return undefined;
    }

    const srcFile = props.asset.contentFiles[0];
    const fullPath = pathe.join(getAppConfig().contentPath, getAppConfig().gameName, srcFile);
    return `file://${fullPath}`;
});

const imageMeta = ref<SharedImageMetaReport | undefined>();

onBeforeMount(async () => {
    if (sourceImageFilePath.value === undefined) return;
    imageMeta.value = await window.electronAPI.image.getMeta(sourceImageFilePath.value);
});
</script>

<template>
    <div v-if="sourceImageFilePath" class="grid grid-cols-2 gap-2 text-sm">
        <div>
            <span class="font-bold">Source Image</span>
            <div class="h-40 border border-accented">
                <img :src="sourceImageFilePath" alt="The Texture" class="max-h-full" />
            </div>
        </div>
        <div class="grid grid-cols-[auto,_1fr] content-start">
            <span class="font-bold col-span-2">Metadata</span>
            <span>Resolution</span>
            <span>{{ imageMeta?.width ?? "?" }}x{{ imageMeta?.height ?? "?" }}</span>
        </div>
    </div>
</template>

<style scoped></style>
