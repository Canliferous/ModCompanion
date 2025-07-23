<template>
    <AssetInspectorTexture v-if="isTextureAsset(assetStore.activeAsset)" :asset="assetStore.activeAsset" />
    <div v-else class="grid place-items-center h-full">No Texture Selected</div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { isTextureAsset } from "Shared/SharedAssetDefinition.js";

const assetStore = useAssetListStore();
</script>

<style scoped></style>
