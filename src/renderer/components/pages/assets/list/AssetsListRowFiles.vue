<script setup lang="ts">
import GameAssetIcon from "~/components/common/GameAssetIcon.vue";
import ContentAssetIcon from "~/components/common/ContentAssetIcon.vue";
import { SharedAsset } from "Shared/SharedAsset.js";

defineProps<{ asset: SharedAsset }>();
</script>

<template>
    <div class="col-span-full grid grid-cols-subgrid gap-y-1">
        <div
            v-for="contentFile in asset.contentFiles"
            class="col-span-full grid grid-cols-subgrid text-amber-500 items-center"
        >
            <ContentAssetIcon />
            <div class="text-sm font-mono max-w-full overflow-x-hidden overflow-ellipsis">{{ contentFile }}</div>
        </div>
        <div
            v-for="gameFile in asset.gameFiles"
            class="col-span-full grid grid-cols-subgrid text-lime-500 items-center"
        >
            <GameAssetIcon />
            <div class="text-sm font-mono max-w-full overflow-x-hidden overflow-ellipsis">{{ gameFile }}</div>
        </div>
    </div>
</template>

<style scoped></style>
