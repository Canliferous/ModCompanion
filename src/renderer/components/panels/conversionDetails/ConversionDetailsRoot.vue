<template>
    <MPanelRoot>
        <div class="grid gap-1 grid-rows-[auto_auto_auto_minmax(0,_1fr)] h-full">
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
            <div class="flex gap-2 items-center flex-wrap">
                <template v-for="(state, i) in event.stateHistory">
                    <MConversionStateBadge :state="state" noAnimation />
                    <UIcon
                        v-if="i !== event.stateHistory.length - 1"
                        :name="AppDesign.Icons.ArrowRight"
                        class="text-neutral-500"
                    />
                </template>
            </div>
            <div class="flex gap-2 items-center text-xs">
                <ConversionsCellTime :date-time="event.startTime" />
                <UIcon :name="AppDesign.Icons.ArrowRight" class="text-neutral-500" />
                <template v-if="event.endTime">
                    <ConversionsCellTime :date-time="event.endTime" />
                    <span class="flex">
                        (<ConversionsCellDuration :start-time="event.startTime" :end-time="event.endTime" />)
                    </span>
                </template>
                <template v-else>
                    <span>Ongoing...</span>
                </template>
            </div>

            <MLogArea :text="event.log" />
        </div>
    </MPanelRoot>
</template>
<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { SharedAssetTypes } from "Shared/SharedAssetDefinition.js";
import { AppDesign } from "~/design/AppDesign.js";
import { SharedConversionEvent } from "Shared/SharedConversion.js";

const assetListStore = useAssetListStore();

const props = defineProps<{ event: SharedConversionEvent }>();

const asset = computed(() => assetListStore.getAssetById(props.event.assetId));
function handleClickAsset() {
    const id = asset.value?.def.id;
    if (id) {
        assetListStore.activate(id);
    }
}
</script>

<style scoped></style>
