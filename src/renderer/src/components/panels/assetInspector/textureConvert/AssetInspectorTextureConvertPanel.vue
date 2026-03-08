<template>
    <AssetInspectorTextureConvertRoot v-if="Shared.Asset.isTextureAsset(assetStore.activeAsset)" :asset="assetStore.activeAsset" />
    <div v-else class="grid place-items-center">No Texture Selected</div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import * as Shared from "mod_companion_shared";

const assetStore = useAssetListStore();
</script>

<style scoped></style>
