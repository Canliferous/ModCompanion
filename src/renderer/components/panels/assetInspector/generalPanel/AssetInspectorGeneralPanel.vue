<template>
    <AssetInspectorGeneral v-if="assetStore.activeAsset" :asset="assetStore.activeAsset" />
    <div v-else class="grid place-items-center text-muted">Nothing Selected</div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";

const assetStore = useAssetListStore();
</script>

<style scoped></style>
