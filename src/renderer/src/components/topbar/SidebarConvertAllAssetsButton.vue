<template>
    <UTooltip text="Force all assets to be converted now">
        <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            label="Convert All"
            :icon="AppDesign.Icons.ActionConvertAsset"
            @click="useAssetConversionStore().enqueueAll()"
        />
    </UTooltip>
</template>

<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { AppDesign } from "~/design/AppDesign.js";
</script>

<style scoped></style>
