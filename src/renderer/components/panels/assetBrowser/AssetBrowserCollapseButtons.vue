<template>
    <UTooltip text="Collapse All">
        <UButton
            color="neutral"
            variant="subtle"
            size="sm"
            @click="assetGroupStore.collapseAll"
            icon="tdesign:shrink-vertical"
        />
    </UTooltip>
    <UTooltip text="Expand All">
        <UButton
            color="neutral"
            variant="subtle"
            size="sm"
            @click="assetGroupStore.expandAll()"
            icon="tdesign:expand-vertical"
        />
    </UTooltip>
</template>

<script setup lang="ts">
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";

const assetGroupStore = useAssetGroupsStore();
</script>

<style scoped></style>
