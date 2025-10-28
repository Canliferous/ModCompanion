<template>
    <TooltipProvider>
        <template v-if="conversionStore.activeHistory">
            <ConversionDetailsRoot :item="conversionStore.activeHistory" />
        </template>
        <template v-else>
            <div class="w-full h-full text-muted grid place-items-center">No conversion selected</div>
        </template>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { TooltipProvider } from "reka-ui";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
const conversionStore = useAssetConversionStore();
</script>

<style scoped></style>
