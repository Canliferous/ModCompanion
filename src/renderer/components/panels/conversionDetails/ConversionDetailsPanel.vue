<template>
    <TooltipProvider>
        <template v-if="conversionStore.activeEvent">
            <ConversionDetailsRoot :event="conversionStore.activeEvent" />
        </template>
        <template v-else>
            <div class="w-full h-full text-muted grid place-items-center">No event selected</div>
        </template>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { TooltipProvider } from "reka-ui";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
const conversionStore = useAssetConversionStore();
</script>

<style scoped></style>
