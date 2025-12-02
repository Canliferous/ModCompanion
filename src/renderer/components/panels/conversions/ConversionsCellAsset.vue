<template>
    <AssetBrowserCellAssetName
        v-if="asset"
        :name="asset.def.displayName ?? '(unknown)'"
        :type="asset.def.type"
        :id="assetId"
    />
    <div v-else>Unknown asset {{ assetId }}</div>
</template>

<script setup lang="ts">
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const assetListStore = useAssetListStore();

const props = defineProps<{ assetId: SharedAssetId }>();

const asset = computed(() => assetListStore.assets.get(props.assetId));
</script>

<style scoped></style>
