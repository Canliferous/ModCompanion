<template>
    <div class="p-1 h-full overflow-y-scroll">
        <template v-for="item in conversionStore.conversionHistory">
            <div>
                {{ item }}
            </div>
        </template>
    </div>
</template>
<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const conversionStore = useAssetConversionStore();
const assetListStore = useAssetListStore();
</script>

<style scoped></style>
