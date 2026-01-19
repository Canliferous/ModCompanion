<template>
    <UTooltip text="Expand All">
        <UButton :icon="AppDesign.Icons.ExpandVertical" @click="assetGroupStore.expandAll()" />
    </UTooltip>
    <UTooltip text="Collapse All">
        <UButton :icon="AppDesign.Icons.CollapseVertical" @click="assetGroupStore.collapseAll" />
    </UTooltip>
</template>

<script setup lang="ts">
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const assetGroupStore = useAssetGroupsStore();
</script>

<style scoped></style>
