<template>
    <div class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-x-2">
        <div class="grid col-span-full grid-cols-subgrid items-center bg-elevated p-2 text-xs tracking-wider">
            <div>Hash</div>
            <div>Asset</div>
        </div>
        <div class="grid col-span-full grid-cols-subgrid overflow-y-scroll">
            <AssetsDataGridRow v-for="asset in listStore.filteredMapPaths" :asset="asset" />
        </div>
    </div>
</template>

<script setup lang="ts">
import AssetsDataGridRow from "./AssetsDataGridRow.vue";
import { useAssetListStore } from "../../../store/AssetListStore.js";
const listStore = useAssetListStore();
</script>

<style scoped></style>
