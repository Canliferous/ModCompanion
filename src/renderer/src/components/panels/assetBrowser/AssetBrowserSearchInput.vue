<template>
    <UInput
        v-model="listStore.searchTerm"
        placeholder="Search"
        :leading-icon="AppDesign.Icons.Search"
        class="grow"
        autofocus
    />
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const listStore = useAssetListStore();
</script>

<style scoped></style>
