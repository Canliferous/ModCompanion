<template>
    <UTooltip text="Expand All">
        <UButton @click="assetGroupStore.expandAll()" :icon="AppDesign.Icons.ExpandVertical" />
    </UTooltip>
    <UTooltip text="Collapse All">
        <UButton @click="assetGroupStore.collapseAll" :icon="AppDesign.Icons.CollapseVertical" />
    </UTooltip>
</template>

<script setup lang="ts">
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const assetGroupStore = useAssetGroupsStore();
</script>

<style scoped></style>
