<template>
    <div class="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] gap-x-2">
        <div
            class="grid col-span-full grid-cols-subgrid items-center bg-elevated py-1.5 px-2 text-xs tracking-wider pr-4 select-none"
        >
            <div></div>
            <div>Asset</div>
            <UTooltip text="Whether this asset is converted"><span>Cnv.</span></UTooltip>
        </div>
        <div class="grid col-span-full grid-cols-subgrid content-start overflow-y-scroll">
            <AssetsListRow v-for="asset in listStore.filteredAssets" :asset="asset" />
        </div>
    </div>
</template>

<script setup lang="ts">
import AssetsListRow from "./AssetsListRow.vue";
import { useAssetListStore } from "../../../../store/AssetListStore.js";
const listStore = useAssetListStore();
</script>

<style scoped></style>
