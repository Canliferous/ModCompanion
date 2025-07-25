<template>
    <div class="h-full grid">
        <slot v-if="assetStore.activeAsset" :activeAsset="assetStore.activeAsset" />
        <div v-else class="grid place-items-center">Nothing Selected</div>
    </div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";

const assetStore = useAssetListStore();
</script>

<style scoped></style>
