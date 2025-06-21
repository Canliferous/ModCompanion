<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { SharedAsset } from "Shared/SharedAsset.js";
import { getAppConfig } from "~/renderer-config.js";
import pathe from "pathe";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { useTextureViewOptionsStore } from "~/store/TextureViewOptionsStore.js";
import AssetsTabTextureChannel from "~/components/pages/assets/tabs/texture/AssetsTabTextureChannel.vue";
import AssetsTabTextureMeta from "~/components/pages/assets/tabs/texture/AssetsTabTextureMeta.vue";
import { base64ImageUrl } from "~/helper/ImageHelper.js";

const props = defineProps<{ asset: SharedAsset }>();
const sourceImageFilePath = computed(() => {
    if (props.asset.contentFiles.length === 0) {
        return undefined;
    }

    const srcFile = props.asset.contentFiles[0];
    const fullPath = pathe.join(getAppConfig().contentPath, getAppConfig().gameName, srcFile);
    return fullPath;
});

const imageMeta = ref<SharedImageMetaReport | undefined>();
const optionsStore = useTextureViewOptionsStore();

onBeforeMount(async () => {
    if (sourceImageFilePath.value === undefined) return;

    const img = await window.electronAPI.image.getMeta(sourceImageFilePath.value);
    imageMeta.value = img;
});
</script>

<template>
    <div v-if="sourceImageFilePath" class="grid grid-cols-2 gap-2 text-sm">
        <div>
            <span class="font-bold">Source Image</span>
            <img v-if="imageMeta?.data" :src="base64ImageUrl(imageMeta.data)" alt="" class="max-h-full" />
        </div>
        <div>
            <div class="font-bold col-span-2 flex justify-between items-center">
                <span>RGBA Channels</span>
                <div class="flex gap-2 items-center">
                    <span class="text-xs">Show Channels</span>
                    <USwitch v-model="optionsStore.showChannels" size="xs" color="info" />
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2" v-if="imageMeta?.channels !== undefined">
                <AssetsTabTextureChannel :data="imageMeta?.channels?.redData" label-name="R" />
                <AssetsTabTextureChannel :data="imageMeta?.channels?.greenData" label-name="G" />
                <AssetsTabTextureChannel :data="imageMeta?.channels?.blueData" label-name="B" />
                <AssetsTabTextureChannel :data="imageMeta?.channels?.alphaData" label-name="A" />
            </div>
        </div>
        <AssetsTabTextureMeta v-if="imageMeta" :image-meta="imageMeta" />
    </div>
</template>

<style scoped></style>
