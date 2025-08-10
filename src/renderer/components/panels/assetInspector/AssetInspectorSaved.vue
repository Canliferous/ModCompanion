<template>
    <UBadge
        label="Saved"
        icon="tdesign:check"
        color="success"
        class="transition-opacity opacity-0"
        :class="{ 'opacity-100': shown }"
    />
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";

const assetListStore = useAssetListStore();

const shown = ref(false);
assetListStore.subscribeAssetsWritten((assetIds) => {
    shown.value = true;
    setTimeout(() => (shown.value = false), 2000);
});
</script>

<style scoped></style>
