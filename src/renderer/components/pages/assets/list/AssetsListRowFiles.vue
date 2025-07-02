<script setup lang="ts">
import { basename } from "pathe";
import GameAssetIcon from "~/components/common/GameAssetIcon.vue";
import ContentAssetIcon from "~/components/common/ContentAssetIcon.vue";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import AssetsListRowFilesAssociated from "~/components/pages/assets/list/AssetsListRowFilesAssociated.vue";

defineProps<{ asset: SharedAsset }>();
</script>

<template>
    <div class="col-span-full grid grid-cols-subgrid gap-y-1">
        <div v-for="contentFile in asset.def.contentFiles" class="col-span-full grid grid-cols-subgrid items-center">
            <ContentAssetIcon />
            <UButton
                size="sm"
                variant="ghost"
                class="text-neutral-300 font-mono max-w-full overflow-x-hidden overflow-ellipsis p-0"
                :label="contentFile"
            />
        </div>
        <div v-for="gameFile in asset.def.gameFiles" class="col-span-full grid grid-cols-subgrid items-center">
            <GameAssetIcon />
            <UButton
                size="sm"
                variant="ghost"
                class="text-neutral-300 font-mono max-w-full overflow-x-hidden overflow-ellipsis p-0"
                :label="gameFile"
            />
        </div>
        <AssetsListRowFilesAssociated v-if="asset.def.associatedFiles" :files="asset.def.associatedFiles" />
    </div>
</template>

<style scoped></style>
