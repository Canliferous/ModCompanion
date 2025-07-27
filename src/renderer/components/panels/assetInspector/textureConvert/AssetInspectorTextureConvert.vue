<template>
    <div>{{ props.asset.def.vtfOptions }}</div>
</template>

<script setup lang="ts">
import { SharedTextureAsset } from "Shared/SharedAssetDefinition.js";

const props = defineProps<{ asset: SharedTextureAsset }>();
</script>

<style scoped></style>
