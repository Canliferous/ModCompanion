<template>
    <div>
        <div v-if="listStore.selectedAsset" class="grid gap-1">
            <div class="bg-accented p-1">
                <span class="text-sm font-mono">{{ listStore.selectedAsset.displayName }}</span>
            </div>
            <div class="border border-amber-500 border-t-0">
                <p class="bg-amber-500 p-1 text-xs text-amber-950 font-bold uppercase">Content files</p>
                <ul class="p-1">
                    <li v-for="asset in listStore.selectedAsset.contentFiles" class="font-mono">
                        {{ asset }}
                    </li>
                </ul>
            </div>
            <div class="border border-lime-500 border-t-0">
                <p class="bg-lime-500 p-1 text-xs text-lime-950 font-bold uppercase">Game files</p>
                <ul class="p-1">
                    <li v-for="asset in listStore.selectedAsset.gameFiles" class="font-mono">
                        {{ asset }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "../../../store/AssetListStore.js";

const listStore = useAssetListStore();
</script>

<style scoped></style>
