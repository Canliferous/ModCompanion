<template>
    <div class="flex items-stretch gap-2 text-xs select-none">
        <span v-if="conversionStore.summary.currentStatus === 'idle'" class="text-muted"> Conversion Agent Idle </span>
        <span v-if="conversionStore.summary.currentStatus === 'working'" class="text-success">
            Conversion Agent Busy
        </span>
        <span class="text-muted"
            ><span class="font-mono">({{ conversionStore.summary.totalSum }}</span> total)</span
        >
    </div>
</template>

<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";

const conversionStore = useAssetConversionStore();
</script>

<style scoped></style>
