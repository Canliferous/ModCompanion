<script setup lang="ts">
import { SharedAsset } from "Shared/SharedAsset.js";

const props = defineProps<{ asset: SharedAsset }>();
</script>

<template>
    <div v-if="asset.contentFiles !== undefined && asset.contentFiles.length > 0">
        <AssetsTabTextureSource :source-file="asset.contentFiles[0]" />
    </div>
</template>

<style scoped></style>
