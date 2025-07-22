<template>
    <!--    <UTooltip :text="listStore.refreshing ? 'Refreshing' : 'Force Refresh'">-->
    <UButton color="neutral" variant="subtle" @click="listStore.forceRefresh()" :disabled="listStore.refreshing">
        <template #default>
            <UIcon name="tdesign:refresh" :class="{ 'animate-spin': listStore.refreshing }" />
        </template>
    </UButton>
    <!--    </UTooltip>-->
</template>

<script setup lang="ts">
import { useAssetListStore } from "../../../store/AssetListStore.js";

const listStore = useAssetListStore();
</script>

<style scoped></style>
