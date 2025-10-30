<template>
    <div class="flex items-center gap-1" v-if="asset">
        <MAssetTypeIcon :type="asset.def.type" />
        <span>{{ asset.def.displayName ?? "(unknown)" }}</span>
    </div>
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
