<template>
    <div class="h-full">
        <template v-if="Shared.Asset.isTextureAsset(asset)">
            <template v-if="myMeta !== undefined">
                <slot :meta="toValue(myMeta)" :asset="asset" />
            </template>
            <MPanelFallbackMessage v-else>Asset has no texture</MPanelFallbackMessage>
        </template>
        <MPanelFallbackMessage v-else>No Texture Selected</MPanelFallbackMessage>
    </div>
</template>

<script setup lang="ts">
import { AssetInspectorBehavior } from "~/components/panels/assetInspector/AssetInspector.model.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import * as Shared from "mod_companion_shared";
import MPanelFallbackMessage from "~/components/common/MPanelFallbackMessage.vue";

const assetStore = useAssetListStore();
const inj = inject(AssetInspectorBehavior.TextureInjectKey);

const myMeta = computed(() => (inj !== undefined ? toValue(inj.meta) : undefined));
const asset = computed(() => assetStore.getAssetById(inj?.assetId));

defineSlots<{
    default(props: { meta: Shared.ImageMeta.SharedImageMetaReport; asset: Shared.Asset.TextureAsset }): any;
}>();
</script>

<style scoped></style>
