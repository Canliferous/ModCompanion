<template>
    <UTooltip text="Collapse All">
        <UButton @click="assetGroupStore.collapseAll" icon="tdesign:shrink-vertical" />
    </UTooltip>
    <UTooltip text="Expand All">
        <UButton @click="assetGroupStore.expandAll()" icon="tdesign:expand-vertical" />
    </UTooltip>
</template>

<script setup lang="ts">
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";

const assetGroupStore = useAssetGroupsStore();
</script>

<style scoped></style>
