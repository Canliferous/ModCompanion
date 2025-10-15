<template>
    <div class="p-1 grid gap-2 grid-rows-[auto_auto_auto_minmax(0,_1fr)] h-full overflow-y-auto">
        <UButton
            color="neutral"
            variant="ghost"
            :label="asset?.def?.displayName ?? '(unknown)'"
            @click="handleClickAsset"
        >
            <template #leading>
                <MAssetTypeIcon :type="asset?.def?.type ?? SharedAssetTypes.Unknown" />
            </template>
        </UButton>
        <div class="flex gap-2 items-center">
            <MConversionStateBadge :state="item.stateBefore" />
            <UIcon name="tdesign:arrow-right" class="text-neutral-500" />
            <MConversionStateBadge :state="item.stateAfter" />
        </div>
        <div class="flex gap-2 items-center">
            <ConversionsCellTime :date-time="item.startTime" />
            <UIcon name="tdesign:arrow-right" class="text-neutral-500" />
            <ConversionsCellTime :date-time="item.endTime" />

            <span class="flex">
                (<ConversionsCellDuration :start-time="item.startTime" :end-time="item.endTime" />)
            </span>
        </div>

        <div class="text-sm bg-neutral-900 border border-accented overflow-y-scroll">
            <pre>{{ item.log }}</pre>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { SharedConversionHistoryItem } from "Shared/SharedConversion.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { SharedAssetTypes } from "Shared/SharedAssetDefinition.js";

const assetListStore = useAssetListStore();

const props = defineProps<{ item: SharedConversionHistoryItem }>();

const asset = computed(() => assetListStore.getAssetById(props.item.assetId));
function handleClickAsset() {
    const id = asset.value?.def.id;
    if (id) {
        assetListStore.activate(id);
    }
}
</script>

<style scoped></style>
