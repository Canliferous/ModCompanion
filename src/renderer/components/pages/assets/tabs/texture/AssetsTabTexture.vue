<script setup lang="ts">
import { SharedTextureAsset } from "Shared/SharedAssetDefinition.js";

defineProps<{ asset: SharedTextureAsset }>();
</script>

<template>
    <div>{{ asset.def.vtfOptions }}</div>

    <div v-if="asset.def.contentFiles !== undefined && asset.def.contentFiles.length > 0">
        <AssetsTabTextureSource :source-file="asset.def.contentFiles[0]" />
    </div>
</template>

<style scoped></style>
