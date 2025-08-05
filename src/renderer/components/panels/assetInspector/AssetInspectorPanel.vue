<template>
    <template v-if="assetStore.activeAsset">
        <div class="grid grid-rows-[auto_minmax(0,_1fr)] h-full">
            <header>
                <AssetInspectorConversion :asset-id="assetStore.activeAsset.def.id" />
            </header>
            <AssetInspector :asset="assetStore.activeAsset" />
        </div>
    </template>
    <div v-else class="grid h-full place-items-center">Nothing Selected</div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";

const assetStore = useAssetListStore();
</script>

<style scoped></style>
