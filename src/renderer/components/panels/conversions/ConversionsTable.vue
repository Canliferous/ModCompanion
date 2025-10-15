<template>
    <UContextMenu :items="items">
        <MDataTable
            :entries="entries"
            :columns="columns"
            neutral-highlight
            @on-active-changed="(entry) => (conversionStore.activeHistory = entry)"
            no-header
        />
    </UContextMenu>
</template>

<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { SharedConversionHistoryItem } from "Shared/SharedConversion.js";
import { DataTableColumn } from "~/components/common/dataTable/MDataTable.model.js";
import ConversionsCellTime from "~/components/panels/conversions/ConversionsCellTime.vue";
import ConversionsCellDuration from "~/components/panels/conversions/ConversionsCellDuration.vue";
import MConversionStateBadge from "~/components/common/MConversionStateBadge.vue";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import { AppDesign } from "~/design/AppDesign.js";

const conversionStore = useAssetConversionStore();
const assetListStore = useAssetListStore();

const entries = computed(() => conversionStore.conversionHistory.toReversed());

const columns: DataTableColumn<SharedConversionHistoryItem>[] = [
    {
        id: "done",
        label: "",
        cell: (entry) => h(ConversionsCellTime, { dateTime: entry.endTime }),
        size: "auto",
    },
    {
        id: "asset",
        label: "Asset",
        cell: (entry) => h("span", assetListStore.assets.get(entry.assetId)?.def.displayName ?? "(unknown)"),
        size: "1fr",
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
        cell: (entry) => h(MConversionStateBadge, { state: entry.stateAfter, variant: "label" }),
        size: "auto",
    },
];

const items = computed<ContextMenuItem[][]>(() => {
    const active = conversionStore.activeHistory;

    return [
        [
            {
                label: "Convert again",
                icon: AppDesign.Icons.ActionConvertAsset,
                color: "success",
                onSelect(e: Event) {
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
