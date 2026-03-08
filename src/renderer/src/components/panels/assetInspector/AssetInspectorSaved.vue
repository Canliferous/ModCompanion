<template>
    <UBadge
        label="Saved"
        :icon="AppDesign.Icons.Check"
        color="success"
        class="transition-opacity opacity-0"
        :class="{ 'opacity-100': shown }"
    />
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const assetListStore = useAssetListStore();

const shown = ref(false);
const timeoutHandle = ref<any | undefined>(undefined);
assetListStore.writtenEvent.on((assetIds) => {
    shown.value = true;
    if (timeoutHandle.value !== undefined) {
        clearTimeout(timeoutHandle.value);
    }
    timeoutHandle.value = setTimeout(() => (shown.value = false), 2000);
});
</script>

<style scoped></style>
