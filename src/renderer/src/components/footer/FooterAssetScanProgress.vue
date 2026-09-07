<template>
    <div class="flex gap-2 text-xs text-magenta-900 items-center px-2">
        <UIcon :name="AppDesign.Icons.Loading" class="animate-spin" />
        <span class="text-nowrap">Scanning Assets</span>
        <UProgress v-model="percent" :max="100" class="w-25 transition-none" />
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const assetListStore = useAssetListStore();
const percent = computed(() => (assetListStore.refreshing ? Math.floor(assetListStore.scanProgress * 100) : 0));
</script>

<style scoped></style>
