<template>
    <div class="p-1 grid gap-1 grid-rows-[auto_auto_auto_minmax(0,_1fr)] h-full overflow-y-auto">
        <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            :label="asset?.def?.displayName ?? '(unknown)'"
            @click="handleClickAsset"
        >
            <template #leading>
                <MAssetTypeIcon :type="asset?.def?.type ?? SharedAssetTypes.Unknown" />
            </template>
        </UButton>
        <div class="flex gap-2 items-center">
            <MConversionStateBadge :state="item.stateBefore" />
            <UIcon :name="AppDesign.Icons.ArrowRight" class="text-neutral-500" />
            <MConversionStateBadge :state="item.stateAfter" />
        </div>
        <div class="flex gap-2 items-center text-xs">
            <ConversionsCellTime :date-time="item.startTime" />
            <UIcon :name="AppDesign.Icons.ArrowRight" class="text-neutral-500" />
            <ConversionsCellTime :date-time="item.endTime" />

            <span class="flex">
                (<ConversionsCellDuration :start-time="item.startTime" :end-time="item.endTime" />)
            </span>
        </div>

        <div class="text-xs bg-neutral-900 border border-accented overflow-y-scroll">
            <pre class="whitespace-pre-wrap">{{ item.log }}</pre>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { SharedAssetTypes } from "Shared/SharedAssetDefinition.js";
import { AppDesign } from "~/design/AppDesign.js";

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
