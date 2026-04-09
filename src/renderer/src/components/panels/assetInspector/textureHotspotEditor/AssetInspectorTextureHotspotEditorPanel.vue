<template>
    <PanelVisibleProvider v-slot="{ visible }" :panel-id="GlobalComponentNames.AssetInspectorTextureHotspotEditor">
        <template v-if="visible">
            <TextureMetaProvider v-slot="{ meta, asset }">
                <AssetInspectorTextureHotspotEditorRoot :meta="meta" :asset="asset" />
            </TextureMetaProvider>
        </template>
    </PanelVisibleProvider>
</template>
<script setup lang="ts">
import AssetInspectorTextureHotspotEditorRoot from "~/components/panels/assetInspector/textureHotspotEditor/AssetInspectorTextureHotspotEditorRoot.vue";
import TextureMetaProvider from "~/components/panels/assetInspector/textureShared/TextureMetaProvider.vue";
import { GlobalComponentNames } from "~/helper/GlobalComponents.js";
</script>

<style scoped></style>
