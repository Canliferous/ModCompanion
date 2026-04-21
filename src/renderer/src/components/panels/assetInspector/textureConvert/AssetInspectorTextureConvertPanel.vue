<template>
    <TextureProvider v-slot="{ asset }">
        <AssetInspectorTextureConvertRoot :asset="asset" />
    </TextureProvider>
</template>

<script setup lang="ts">
import TextureProvider from "~/components/panels/assetInspector/TextureProvider.vue";
</script>

<style scoped></style>
