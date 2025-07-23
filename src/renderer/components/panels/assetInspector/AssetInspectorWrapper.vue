<template>
    <slot v-if="assetStore.activeAsset" :activeAsset="assetStore.activeAsset" />
    <div v-else class="grid place-items-center h-full">Nothing Selected</div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";

const assetStore = useAssetListStore();
</script>

<style scoped></style>
