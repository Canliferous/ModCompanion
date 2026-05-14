<template>
    <TooltipProvider>
        <AssetProvider v-slot="{ asset }">
            <AssetInspectorGeneralRoot :asset="asset" />
        </AssetProvider>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { TooltipProvider } from "reka-ui";
</script>

<style scoped></style>
