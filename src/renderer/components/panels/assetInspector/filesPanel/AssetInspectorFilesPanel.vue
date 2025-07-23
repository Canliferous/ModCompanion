<template>
    <AssetInspectorWrapper v-slot="{ activeAsset }">
        <AssetInspectorFiles :asset="activeAsset" />
    </AssetInspectorWrapper>
</template>

<script setup lang="ts">
import AssetInspectorWrapper from "~/components/panels/assetInspector/AssetInspectorWrapper.vue";
</script>

<style scoped></style>
