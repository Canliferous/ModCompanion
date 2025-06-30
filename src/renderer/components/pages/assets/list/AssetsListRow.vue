<template>
    <button
        class="grid col-span-full grid-cols-subgrid p-1 items-center justify-center border-b-1 border-accented hover:bg-accented cursor-pointer text-left text-neutral-300 focus-visible:outline-none"
        :class="{ 'bg-primary/10 text-primary hover:bg-primary/30': isSelected }"
        @click="listStore.selectAsset(asset.id)"
        @keydown.down="navigateDown()"
        @keydown.up="navigateUp()"
        ref="btn"
    >
        <div class="grid col-span-full grid-cols-subgrid gap-y-1">
            <div class="flex items-center"><AssetTypeIcon :type="asset.type" /></div>
            <div class="text-sm font-mono">
                {{ asset.displayName }}
            </div>
            <AssetsListRowConverted :state="conversionStore.getState(asset.id)" />
            <AssetsListRowFiles v-if="isSelected" :asset="asset" />
        </div>
    </button>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from "vue";
import { SharedAsset } from "Shared/SharedAsset.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import AssetTypeIcon from "~/components/common/AssetTypeIcon.vue";
import AssetsListRowFiles from "~/components/pages/assets/list/AssetsListRowFiles.vue";
import AssetsListRowConverted from "~/components/pages/assets/list/AssetsListRowConverted.vue";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";

const conversionStore = useAssetConversionStore();
const listStore = useAssetListStore();

const props = defineProps<{ asset: SharedAsset }>();
const isSelected = computed(() => listStore.selectedAssetHash === props.asset.id);

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

    const index = listStore.filteredAssets.findIndex((a) => a.id === hash);
    const nextIndex = index + 1;
    if (nextIndex > listStore.filteredAssets.length - 1) {
        return;
    }
    const nextHash = listStore.filteredAssets[nextIndex].id;
    listStore.selectAsset(nextHash);
}
function navigateUp() {
    const hash = listStore.selectedAssetHash;
    if (!hash) {
        return;
    }

    const index = listStore.filteredAssets.findIndex((a) => a.id === hash);
    const nextIndex = index - 1;
    if (nextIndex < 0) {
        return;
    }

    const nextHash = listStore.filteredAssets[nextIndex].id;
    listStore.selectAsset(nextHash);
}
</script>

<style scoped></style>
