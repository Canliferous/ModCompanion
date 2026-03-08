<template>
    <MDataTable
        :entries="listStore.filteredMapList"
        :columns="columns"
        neutral-highlight
        no-scroll
        @on-active-changed="handleActiveChanged"
    />
</template>

<script setup lang="ts">
import { useMapListStore } from "~/store/MapListStore.js";
import { useMapTimeReportStore } from "~/store/MapTimeReportStore.js";
import { DataTableColumn } from "~/components/common/dataTable/MDataTable.model.js";
import { computed } from "vue";
import MapsDataGridProgressCell from "~/components/panels/maps/list/MapsDataGridProgressCell.vue";
import { SharedMapCompileStep } from "Shared/SharedMap.js";
import MapsDataGridActionsCell from "~/components/panels/maps/list/MapsDataGridActionsCell.vue";
import MapsDataGridTimeReportTotalCell from "~/components/panels/maps/list/MapsDataGridTimeReportTotalCell.vue";
import MapsDataGridTimeReportCell from "~/components/panels/maps/list/MapsDataGridTimeReportCell.vue";
import MapsDataGridTimeReportBarCell from "~/components/panels/maps/list/MapsDataGridTimeReportBarCell.vue";

const listStore = useMapListStore();
const timeReportStore = useMapTimeReportStore();

const columns = computed(() => (timeReportStore.showReport ? reportColumns : listColumns));

const listColumns: DataTableColumn<string>[] = [
    {
        id: "name",
        label: "Name",
        size: "1fr",
        cell: (entry) => h("span", { class: "tabular-nums text-sm" }, listStore.mapDisplayList.get(entry)),
    },
    {
        id: "vbsp",
        label: "VBSP",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.VBsp }),
        headerClass: "text-center px-1",
    },
    {
        id: "post",
        label: "POST",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.Post }),
        headerClass: "text-center px-1",
    },
    {
        id: "vvis",
        label: "VVIS",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.VVis }),
        headerClass: "text-center px-1",
    },
    {
        id: "vrad",
        label: "VRAD",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.VRad }),
        headerClass: "text-center px-1",
    },
    {
        id: "game",
        label: "GAME",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.Game }),
        headerClass: "text-center px-1",
    },
    {
        id: "done",
        label: "DONE",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.Done }),
        headerClass: "text-center px-1",
    },
    {
        id: "actions",
        label: "",
        cell: (entry) => h(MapsDataGridActionsCell, { mapPath: entry }),
        headerClass: "text-center px-1",
    },
];

const reportColumns: DataTableColumn<string>[] = [
    {
        id: "name",
        label: "Name",
        size: "1fr",
        cell: (entry) =>
            h(MapsDataGridTimeReportBarCell, {
                mapPath: entry,
                displayName: listStore.mapDisplayList.get(entry) ?? entry,
            }),
    },
    {
        id: "vbsp",
        label: "VBSP",
        cell: (entry) => h(MapsDataGridTimeReportCell, { mapPath: entry, step: SharedMapCompileStep.VBsp }),
        headerClass: "text-center px-2",
    },
    {
        id: "vvis",
        label: "VVIS",
        cell: (entry) => h(MapsDataGridTimeReportCell, { mapPath: entry, step: SharedMapCompileStep.VVis }),
        headerClass: "text-center px-2",
    },
    {
        id: "vrad",
        label: "VRAD",
        cell: (entry) => h(MapsDataGridTimeReportCell, { mapPath: entry, step: SharedMapCompileStep.VRad }),
        headerClass: "text-center px-2",
    },
    {
        id: "total",
        label: "TOTAL",
        cell: (entry) => h(MapsDataGridTimeReportTotalCell, { mapPath: entry }),
        headerClass: "text-center px-2",
    },
    {
        id: "actions",
        label: "",
        cell: (entry) => h(MapsDataGridActionsCell, { mapPath: entry }),
        headerClass: "text-center px-2",
    },
];

function handleActiveChanged(map: string | undefined): void {
    listStore.selectMap(map);
}
</script>

<style scoped></style>
