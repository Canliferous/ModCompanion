<template>
    <UTooltip :text="listStore.refreshing ? 'Refreshing' : 'Force Refresh'">
        <UButton :disabled="listStore.refreshing" @click="handleRefresh">
            <template #default>
                <UIcon
                    :name="listStore.refreshing ? AppDesign.Icons.Loading : AppDesign.Icons.ActionRefresh"
                    :class="{ 'animate-spin': listStore.refreshing }"
                />
            </template>
        </UButton>
    </UTooltip>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { useAssetGroupsStore } from "~/store/AssetGroupsStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const listStore = useAssetListStore();

function handleRefresh() {
    listStore.refresh();
    useAssetGroupsStore().refresh();
}
</script>

<style scoped></style>
