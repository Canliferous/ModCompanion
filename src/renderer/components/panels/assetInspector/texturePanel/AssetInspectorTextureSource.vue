<script setup lang="ts">
import { ref } from "vue";
import { getAppConfig } from "~/renderer-config.js";
import pathe from "pathe";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { useTextureViewOptionsStore } from "~/store/TextureViewOptionsStore.js";
import AssetsTabTextureChannel from "~/components/pages/assets/tabs/texture/AssetsTabTextureChannel.vue";
import AssetsTabTextureMetaTable from "~/components/pages/assets/tabs/texture/AssetsTabTextureMetaTable.vue";
import { base64ImageUrl } from "~/helper/ImageHelper.js";
import { useImageCacheStore } from "~/store/ImageCacheStore.js";

const props = defineProps<{ sourceFile: string }>();

const optionsStore = useTextureViewOptionsStore();
const imageCacheStore = useImageCacheStore();

const fullPath = computed(() => pathe.join(getAppConfig().contentPath, props.sourceFile));

const imageMeta = ref<SharedImageMetaReport | undefined>();

watch(fullPath, async () => {
    imageMeta.value = await imageCacheStore.getMeta(fullPath.value);
});
imageCacheStore.getMeta(fullPath.value).then((meta) => (imageMeta.value = meta));

function onOpen() {
    window.electronAPI.app.openFile(fullPath.value);
}
function onBrowse() {
    window.electronAPI.app.browseToFile(fullPath.value);
}
</script>

<template>
    <div class="@container">
        <div
            class="grid grid-cols-1 @lg:grid-cols-[auto_auto] @2xl:grid-cols-[auto_auto_auto] justify-start gap-2 text-sm p-2"
        >
            <div class="max-h-60">
                <img v-if="imageMeta?.data" :src="base64ImageUrl(imageMeta.data)" alt="" class="max-h-full" />
            </div>
            <div
                class="grid grid-cols-[auto_auto] grid-rows-2 gap-2 justify-start max-h-60"
                v-if="imageMeta?.channels !== undefined"
            >
                <AssetInspectorTextureChannel :data="imageMeta?.channels?.redData" label-name="R" />
                <AssetInspectorTextureChannel :data="imageMeta?.channels?.greenData" label-name="G" />
                <AssetInspectorTextureChannel :data="imageMeta?.channels?.blueData" label-name="B" />
                <AssetInspectorTextureChannel :data="imageMeta?.channels?.alphaData" label-name="A" />
            </div>
            <AssetInspectorTextureMetaTable v-if="imageMeta" :image-meta="imageMeta" />
        </div>

        <div class="mx-2" />

        <div class="p-2 flex items-center gap-2">
            <UButton label="Open" size="xs" color="neutral" variant="subtle" @click="onOpen" />
            <UButton label="Browse To" size="xs" color="neutral" variant="subtle" @click="onBrowse" />
            <div class="ml-auto">
                <UCheckbox v-model="optionsStore.showChannels" size="sm" color="neutral" label="Show Channels" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
