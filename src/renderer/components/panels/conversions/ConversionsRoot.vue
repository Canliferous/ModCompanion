<template>
    <div class="p-1 h-full overflow-y-scroll">
        <template v-for="conv in conversionStore.conversions.values()">
            <div>
                <span>{{ assetListStore.assets.get(conv.hash)?.def.displayName ?? "(unknown)" }}</span>
                <ConversionStateBadge :state="conv.state" />
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
