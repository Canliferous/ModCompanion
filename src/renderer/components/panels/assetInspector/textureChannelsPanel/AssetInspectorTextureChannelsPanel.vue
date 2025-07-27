<template>
    <TextureMetaProvider v-slot="{ meta }">
        <AssetInspectorTextureChannels :meta="meta" />
    </TextureMetaProvider>
</template>

<script setup lang="ts">
import TextureMetaProvider from "~/components/panels/assetInspector/textureShared/TextureMetaProvider.vue";
</script>

<style scoped></style>
