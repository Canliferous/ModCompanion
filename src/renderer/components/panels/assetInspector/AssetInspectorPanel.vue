<template>
    <TooltipProvider>
        <template v-if="assetStore.activeAsset">
            <div class="grid grid-rows-[auto_minmax(0,_1fr)] h-full">
                <header class="flex m-2">
                    <AssetInspectorConversion :asset-id="assetStore.activeAsset.def.id" />
                    <div class="ml-auto">
                        <AssetInspectorSaved />
                    </div>
                </header>
                <AssetInspectorRoot :asset="assetStore.activeAsset" />
            </div>
        </template>
        <div v-else class="grid h-full place-items-center">Nothing Selected</div>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { TooltipProvider } from "reka-ui";
import AssetInspectorSaved from "~/components/panels/assetInspector/AssetInspectorSaved.vue";

const assetStore = useAssetListStore();
</script>

<style scoped></style>
