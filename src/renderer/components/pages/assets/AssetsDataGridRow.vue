<template>
    <button
        class="grid col-span-full grid-cols-subgrid p-1 items-center justify-center border-b-1 border-accented hover:bg-accented cursor-pointer text-left focus-visible:outline-none"
        :class="{ 'bg-primary/10 text-primary hover:bg-primary/30': isSelected }"
        @click="listStore.selectAsset(asset.hash)"
        @keydown.down="navigateDown()"
        @keydown.up="navigateUp()"
        ref="btn"
    >
        <div class="grid col-span-full grid-cols-subgrid gap-y-1">
            <div class="flex items-center"><AssetTypeIcon :type="asset.type" /></div>
            <div class="text-sm font-mono">{{ asset.displayName }}</div>

            <div v-if="isSelected" class="col-span-full grid grid-cols-subgrid gap-y-1">
                <div
                    v-for="contentFile in asset.contentFiles"
                    class="col-span-full grid grid-cols-subgrid text-amber-500 items-center"
                >
                    <ContentAssetIcon />
                    <div class="text-sm font-mono">{{ contentFile }}</div>
                </div>
                <div
                    v-for="gameFile in asset.gameFiles"
                    class="col-span-full grid grid-cols-subgrid text-lime-500 items-center"
                >
                    <GameAssetIcon />
                    <div class="text-sm font-mono">{{ gameFile }}</div>
                </div>
            </div>
        </div>
    </button>
</template>

<script setup lang="ts">
import { SharedAsset } from "../../../../shared/SharedAsset.js";
import { useAssetListStore } from "../../../store/AssetListStore.js";
import { computed, useTemplateRef, watch } from "vue";
import AssetTypeIcon from "../../common/AssetTypeIcon.vue";
import GameAssetIcon from "../../common/GameAssetIcon.vue";
import ContentAssetIcon from "../../common/ContentAssetIcon.vue";

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
