<template>
    <div>
        <div v-if="listStore.selectedAsset" class="grid gap-1">
            <div class="bg-accented p-1">
                <span class="text-sm font-mono">{{ listStore.selectedAsset.displayName }}</span>
            </div>
            <AssetsInfoFiles color="amber" :files="listStore.selectedAsset.contentFiles" header="Content Files" />
            <AssetsInfoFiles color="lime" :files="listStore.selectedAsset.gameFiles" header="Game Files" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "../../../store/AssetListStore.js";
import AssetsInfoFiles from "~/components/pages/assets/AssetsInfoFiles.vue";

const listStore = useAssetListStore();
</script>

<style scoped></style>
