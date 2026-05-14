<template>
    <TextureProvider v-slot="{ meta }">
        <AssetInspectorTextureMetadataRoot :meta="meta" />
    </TextureProvider>
</template>

<script setup lang="ts">
import TextureProvider from "~/components/panels/assetInspector/TextureProvider.vue";
</script>

<style scoped></style>
