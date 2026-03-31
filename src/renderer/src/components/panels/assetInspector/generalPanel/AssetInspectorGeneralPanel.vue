<template>
    <TooltipProvider>
        <AssetInspectorGeneralRoot v-if="assetStore.activeAsset" :asset="assetStore.activeAsset" />
        <div v-else class="grid place-items-center text-muted">Nothing Selected</div>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { TooltipProvider } from "reka-ui";

const assetStore = useAssetListStore();
</script>

<style scoped></style>
