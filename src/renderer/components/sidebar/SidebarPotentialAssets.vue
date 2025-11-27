<template>
    <UBadge v-if="assetListStore.potentialAssets" size="md" variant="soft" class="justify-center">
        {{ assetListStore.potentialAssets.length }} New Assets
    </UBadge>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";

const assetListStore = useAssetListStore();
</script>

<style scoped></style>
