<template>
    <div class="h-full grid grid-rows-[minmax(0,_1fr)_auto] grid-cols-[minmax(0,_1fr)]">
        <template v-if="conversionStore.conversionEvents.length > 0">
            <ConversionsTable :history="conversionStore.conversionEvents" />
        </template>

        <template v-else>
            <div class="grid place-items-center h-full text-muted">No conversions yet</div>
        </template>
        <div class="flex gap-1 items-center p-1">
            <UButton size="xs" label="Convert All" @click="handleConvertAll" />
            <UButton size="xs" label="Clear" @click="handleClear" />
        </div>
    </div>
</template>
<script setup lang="ts">
import ConversionsTable from "~/components/panels/conversions/ConversionsTable.vue";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";

const conversionStore = useAssetConversionStore();

function handleConvertAll() {
    const assetIds = conversionStore.conversions.keys();
    for (const assetId of assetIds) {
        conversionStore.enqueue(assetId);
    }
}

function handleClear() {
    window.electronAPI.conversion.clearEvents();
}
</script>

<style scoped></style>
