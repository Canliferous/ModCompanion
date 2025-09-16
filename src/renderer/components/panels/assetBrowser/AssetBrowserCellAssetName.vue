<template>
    <div class="flex items-center gap-1">
        <div :style="`width: ${depth}rem`" />
        <AssetTypeIcon :type />
        <div class="text-sm font-mono text-neutral-300 text-ellipsis overflow-hidden text-left" dir="rtl">
            &lrm;{{ name }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { SharedAssetType } from "Shared/SharedAssetDefinition.js";

defineProps<{ name: string; type: SharedAssetType; depth: number }>();
</script>

<style scoped></style>
