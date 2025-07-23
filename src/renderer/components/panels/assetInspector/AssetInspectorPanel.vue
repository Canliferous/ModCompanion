<template>
    <AssetInspectorWrapper v-slot="{ activeAsset }">
        <AssetInspector :asset="activeAsset" />
    </AssetInspectorWrapper>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import AssetInspectorWrapper from "~/components/panels/assetInspector/AssetInspectorWrapper.vue";

const assetStore = useAssetListStore();
</script>

<style scoped></style>
