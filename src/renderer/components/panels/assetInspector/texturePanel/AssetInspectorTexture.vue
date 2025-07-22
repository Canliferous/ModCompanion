<script setup lang="ts">
import { SharedTextureAsset } from "Shared/SharedAssetDefinition.js";

defineProps<{ asset: SharedTextureAsset }>();
</script>

<template>
    <div class="grid grid-cols-1 gap-1">
        <div v-if="asset.def.contentFiles !== undefined && asset.def.contentFiles.length > 0">
            <AssetInspectorTextureSource :source-file="asset.def.contentFiles[0]" />
        </div>
        <AssetInspectorTextureVtfOptions :asset="asset" />
    </div>
</template>

<style scoped></style>
