<template>
    <UInput
        placeholder="Search"
        leading-icon="tdesign:search"
        size="sm"
        class="grow"
        autofocus
        v-model="listStore.searchTerm"
    />
</template>

<script setup lang="ts">
import { useAssetListStore } from "../../../store/AssetListStore.js";

const listStore = useAssetListStore();
</script>

<style scoped></style>
