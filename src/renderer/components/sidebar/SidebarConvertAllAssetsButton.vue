<template>
    <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        label="Convert All"
        icon="empty"
        @click="useAssetConversionStore().enqueueAll()"
    />
</template>

<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
</script>

<style scoped></style>
