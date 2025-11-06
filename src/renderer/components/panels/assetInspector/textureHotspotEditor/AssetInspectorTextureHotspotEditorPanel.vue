<template>
    <TextureMetaProvider v-slot="{ meta }">
        <AssetInspectorTextureHotspotEditorRoot :meta="meta" />
    </TextureMetaProvider>
</template>
<script setup lang="ts">
import AssetInspectorTextureHotspotEditorRoot from "~/components/panels/assetInspector/textureHotspotEditor/AssetInspectorTextureHotspotEditorRoot.vue";
import TextureMetaProvider from "~/components/panels/assetInspector/textureShared/TextureMetaProvider.vue";
</script>

<style scoped></style>
