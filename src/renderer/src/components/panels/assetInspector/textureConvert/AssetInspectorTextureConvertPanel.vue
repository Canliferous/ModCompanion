<template>
    <AssetInspectorTextureConvertRoot v-if="Shared.Asset.isTextureAsset(asset)" :asset="asset" />
    <div v-else class="grid place-items-center">No Texture Selected</div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import * as Shared from "mod_companion_shared";
import { AssetInspectorBehavior } from "~/components/panels/assetInspector/AssetInspector.model.js";
const assetListStore = useAssetListStore();

const inj = inject(AssetInspectorBehavior.AssetInjectKey);
const asset = computed(() => assetListStore.getAssetById(inj?.assetId));
</script>

<style scoped></style>
