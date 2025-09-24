<template>
    <UTooltip :text="listStore.refreshing ? 'Refreshing' : 'Force Refresh'">
        <UButton color="neutral" variant="subtle" size="sm" @click="handleRefresh" :disabled="listStore.refreshing">
            <template #default>
                <UIcon name="tdesign:refresh" :class="{ 'animate-spin': listStore.refreshing }" />
            </template>
        </UButton>
    </UTooltip>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";

const listStore = useAssetListStore();

function handleRefresh() {
    listStore.forceRefresh();
    useAssetGroupsStore().forceRefresh();
}
</script>

<style scoped></style>
