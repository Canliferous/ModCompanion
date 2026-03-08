<template>
    <AssetBrowserCellAssetName
        v-if="asset"
        :id="assetId"
        :name="asset.def.displayName ?? '(unknown)'"
        :type="asset.def.type"
    />
    <div v-else>Unknown asset {{ assetId }}</div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import * as Shared from "mod_companion_shared";

const assetListStore = useAssetListStore();

const props = defineProps<{ assetId: Shared.Asset.AssetId }>();

const asset = computed(() => assetListStore.assets.get(props.assetId));
</script>

<style scoped></style>
