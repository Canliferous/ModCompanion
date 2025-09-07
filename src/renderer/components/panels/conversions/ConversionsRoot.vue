<template>
    <div>
        <UContextMenu :items="items">
            <DataTable
                :entries="entries"
                :columns="columns"
                neutral-highlight
                @on-active-changed="handleActiveChanged"
            />
        </UContextMenu>
    </div>
</template>
<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import { DataTableColumn } from "~/components/common/DataTable/DataTable.model.js";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { SharedConversionHistoryItem } from "Shared/SharedConversion.js";
import ConversionStateBadge from "~/components/common/ConversionStateBadge.vue";
import ConversionsCellTime from "~/components/panels/conversions/ConversionsCellTime.vue";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import ConversionsCellDuration from "~/components/panels/conversions/ConversionsCellDuration.vue";

const conversionStore = useAssetConversionStore();
const assetListStore = useAssetListStore();

const entries = computed(() => conversionStore.conversionHistory.toReversed());

const activeItem = ref<SharedConversionHistoryItem | undefined>();

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
        cell: (entry) => h(ConversionStateBadge, { state: entry.stateAfter, variant: "label" }),
        size: "auto",
    },
];

function handleActiveChanged(idx: number | undefined) {
    if (idx === undefined) {
        activeItem.value = undefined;
        return;
    }

    activeItem.value = entries.value[idx];
}

const items = computed<ContextMenuItem[][]>(() => {
    const active = activeItem.value;

    return [
        [
            {
                label: "Convert again",
                icon: "tdesign:play",
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
