<template>
    <UContextMenu :items="items">
        <MDataTable
            :entries="entries"
            :columns="columns"
            neutral-highlight
            no-header
            no-scroll
            @on-active-changed="(entry) => (conversionStore.activeEvent = entry)"
        />
    </UContextMenu>
</template>

<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { SharedConversionEvent } from "Shared/SharedConversion.js";
import { DataTableColumn } from "~/components/common/dataTable/MDataTable.model.js";
import ConversionsCellDuration from "~/components/panels/conversions/ConversionsCellDuration.vue";
import MConversionStateBadge from "~/components/common/MConversionStateBadge.vue";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import { AppDesign } from "~/design/AppDesign.js";
import ConversionsCellAsset from "~/components/panels/conversions/ConversionsCellAsset.vue";

const conversionStore = useAssetConversionStore();

const props = defineProps<{ history: SharedConversionEvent[] }>();
const entries = computed(() => props.history.toReversed());

const columns: DataTableColumn<SharedConversionEvent>[] = [
    {
        id: "asset",
        label: "Asset",
        cell: (entry) => h(ConversionsCellAsset, { assetId: entry.assetId }),
        size: "minmax(0, 1fr)",
    },
    {
        id: "duration",
        label: "Duration",
        cell: (entry) => h(ConversionsCellDuration, { startTime: entry.startTime, endTime: entry.endTime }),
        size: "auto",
    },
    {
        id: "status",
        label: "Status",
        cell: (entry) =>
            h(MConversionStateBadge, {
                state: entry.stateHistory[Math.max(entry.stateHistory.length - 1, 0)],
                class: "min-w-24",
                variant: "label",
            }),
        size: "auto",
    },
];

const items = computed<ContextMenuItem[][]>(() => {
    const active = conversionStore.activeEvent;

    return [
        [
            {
                label: "Convert again",
                icon: AppDesign.Icons.ActionConvertAsset,
                color: "success",
                onSelect() {
                    if (active) {
                        conversionStore.enqueue(active?.assetId);
                    }
                },
                disabled: active === undefined,
            },
        ],
    ] satisfies ContextMenuItem[][];
});
</script>

<style scoped></style>
