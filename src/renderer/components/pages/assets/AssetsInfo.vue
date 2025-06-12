<template>
    <div>
        <div v-if="listStore.selectedAsset">
            <p>{{ listStore.selectedAsset.displayName }}</p>
            <p>Content files</p>
            <ul>
                <li v-for="asset in listStore.selectedAsset.contentFiles">
                    {{ asset }}
                </li>
            </ul>
            <p>Game files</p>
            <ul>
                <li v-for="asset in listStore.selectedAsset.gameFiles">
                    {{ asset }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "../../../store/AssetListStore.js";

const listStore = useAssetListStore();
</script>

<style scoped></style>
