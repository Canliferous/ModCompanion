<template>
    <button
        class="grid col-span-full grid-cols-subgrid p-1 items-center justify-center border-b-1 border-accented hover:bg-accented cursor-pointer text-left focus-visible:outline-none"
        :class="{ 'bg-primary/10 text-primary hover:bg-primary/30': isSelected }"
        @click="listStore.selectAsset(asset.hash)"
        @keydown.down="navigateDown()"
        @keydown.up="navigateUp()"
        ref="btn"
    >
        <span class="text-xs font-mono">{{ asset.hash.substring(0, 5) }}</span>
        <span class="text-sm">{{ asset.displayName }}</span>
    </button>
</template>

<script setup lang="ts">
import { SharedAsset } from "../../../../shared/SharedAsset.js";
import { useAssetListStore } from "../../../store/AssetListStore.js";
import { computed, useTemplateRef, watch } from "vue";

const listStore = useAssetListStore();

const props = defineProps<{ asset: SharedAsset }>();
const isSelected = computed(() => listStore.selectedAssetHash === props.asset.hash);

const btn = useTemplateRef("btn");

watch(isSelected, (selected) => {
    if (selected) {
        btn.value?.focus();
    }
});

function navigateDown() {
    const hash = listStore.selectedAssetHash;
    if (!hash) {
        return;
    }

    const index = listStore.filteredAssets.findIndex((a) => a.hash === hash);
    const nextIndex = index + 1;
    if (nextIndex > listStore.filteredAssets.length - 1) {
        return;
    }
    const nextHash = listStore.filteredAssets[nextIndex].hash;
    listStore.selectAsset(nextHash);
}
function navigateUp() {
    const hash = listStore.selectedAssetHash;
    if (!hash) {
        return;
    }

    const index = listStore.filteredAssets.findIndex((a) => a.hash === hash);
    const nextIndex = index - 1;
    if (nextIndex < 0) {
        return;
    }

    const nextHash = listStore.filteredAssets[nextIndex].hash;
    listStore.selectAsset(nextHash);
}
</script>

<style scoped></style>
