<template>
    <DataTable :entries="listStore.filteredMapPaths" :columns="columns" />
</template>

<script setup lang="ts">
import { useMapListStore } from "~/store/MapListStore.js";
import { useMapTimeReportStore } from "~/store/MapTimeReportStore.js";
import { DataTableColumn } from "~/components/common/DataTable/DataTable.model.js";
import { computed } from "vue";
import pathe from "pathe";
import { filename } from "pathe/utils";
import MapsDataGridProgressCell from "~/components/panels/maps/list/MapsDataGridProgressCell.vue";
import { SharedMapCompileStep } from "Shared/SharedMapCompile.js";
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
        cell: (entry) => h("span", { class: "font-mono text-sm" }, mapDisplayNames.value.get(entry)),
    },
    {
        id: "vbsp",
        label: "VBSP",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.VBsp }),
        headerClass: "text-center px-2",
    },
    {
        id: "post",
        label: "POST",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.Post }),
        headerClass: "text-center px-2",
    },
    {
        id: "vvis",
        label: "VVIS",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.VVis }),
        headerClass: "text-center px-2",
    },
    {
        id: "vrad",
        label: "VRAD",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.VRad }),
        headerClass: "text-center px-2",
    },
    {
        id: "game",
        label: "GAME",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.Game }),
        headerClass: "text-center px-2",
    },
    {
        id: "done",
        label: "DONE",
        cell: (entry) => h(MapsDataGridProgressCell, { mapPath: entry, step: SharedMapCompileStep.Done }),
        headerClass: "text-center px-2",
    },
    {
        id: "actions",
        label: "",
        cell: (entry) => h(MapsDataGridActionsCell, { mapPath: entry }),
        headerClass: "text-center px-2",
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
                displayName: mapDisplayNames.value.get(entry) ?? entry,
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

const mapDisplayNames = computed(() => {
    let prefix: string | undefined = undefined;
    let addPrefix = false;

    for (const p of listStore.mapPaths) {
        const dirName = pathe.dirname(p);
        if (prefix === undefined) {
            prefix = dirName;
        } else if (prefix !== dirName) {
            addPrefix = true;
            break;
        }
    }

    const map = new Map<string, string>();
    for (const p of listStore.mapPaths) {
        const fileName = filename(p) ?? "";
        if (addPrefix) {
            const dirName = pathe.dirname(p);
            map.set(p, pathe.join(dirName, fileName));
        } else {
            map.set(p, fileName);
        }
    }

    return map;
});
</script>

<style scoped></style>
