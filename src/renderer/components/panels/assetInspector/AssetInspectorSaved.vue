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
const timeoutHandle = ref<any | undefined>(undefined);
assetListStore.subscribeAssetsWritten((assetIds) => {
    shown.value = true;
    if (timeoutHandle.value !== undefined) {
        clearTimeout(timeoutHandle.value);
    }
    timeoutHandle.value = setTimeout(() => (shown.value = false), 2000);
});
</script>

<style scoped></style>
