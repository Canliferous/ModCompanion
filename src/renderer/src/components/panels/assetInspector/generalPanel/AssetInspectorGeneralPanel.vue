<template>
    <TooltipProvider>
        <AssetInspectorGeneralRoot v-if="asset" :asset="asset" />
        <div v-else class="grid place-items-center text-muted">Invalid asset</div>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { TooltipProvider } from "reka-ui";
import { AssetInspectorBehavior } from "~/components/panels/assetInspector/AssetInspector.model.js";

const assetListStore = useAssetListStore();

const inj = inject(AssetInspectorBehavior.AssetInjectKey);
const asset = computed(() => assetListStore.getAssetById(inj?.assetId));
</script>

<style scoped></style>
