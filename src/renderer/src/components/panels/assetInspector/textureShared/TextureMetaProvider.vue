<template>
    <div class="h-full">
        <template v-if="Shared.Asset.isTextureAsset(assetStore.activeAsset)">
            <template v-if="myMeta !== undefined">
                <slot :meta="toValue(myMeta)" :asset="assetStore.activeAsset" />
            </template>
            <div v-else class="grid place-items-center h-full">Asset has no texture</div>
        </template>
        <div v-else class="grid place-items-center h-full">No Texture Selected</div>
    </div>
</template>

<script setup lang="ts">
import { AssetInspectorTextureInjectKey } from "~/components/panels/assetInspector/AssetInspector.model.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import * as Shared from "mod_companion_shared";

const assetStore = useAssetListStore();
const inj = inject(AssetInspectorTextureInjectKey);

const myMeta = computed(() => (inj !== undefined ? toValue(inj.meta) : undefined));

defineSlots<{
    default(props: { meta: Shared.ImageMeta.SharedImageMetaReport; asset: Shared.Asset.TextureAsset }): any;
}>();
</script>

<style scoped></style>
