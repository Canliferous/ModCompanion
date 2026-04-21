<template>
    <PanelVisibleProvider v-slot="{ visible }" :panel-id="GlobalComponentNames.AssetInspectorTextureHotspotEditor">
        <template v-if="visible">
            <TextureProvider v-slot="{ meta, asset }">
                <AssetInspectorTextureHotspotEditorRoot :meta="meta" :asset="asset" />
            </TextureProvider>
        </template>
    </PanelVisibleProvider>
</template>
<script setup lang="ts">
import AssetInspectorTextureHotspotEditorRoot from "~/components/panels/assetInspector/textureHotspotEditor/AssetInspectorTextureHotspotEditorRoot.vue";
import TextureProvider from "~/components/panels/assetInspector/TextureProvider.vue";
import { GlobalComponentNames } from "~/helper/GlobalComponents.js";
</script>

<style scoped></style>
