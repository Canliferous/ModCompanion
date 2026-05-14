<template>
    <TextureProvider v-slot="{ meta }">
        <AssetInspectorTextureChannelsRoot :meta="meta" />
    </TextureProvider>
</template>

<script setup lang="ts">
import TextureProvider from "~/components/panels/assetInspector/TextureProvider.vue";
</script>

<style scoped></style>
