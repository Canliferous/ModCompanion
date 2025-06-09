<template>
    <div
        class="grid col-span-full grid-cols-subgrid grid-rows-1 p-2 items-center border-b-1 border-accented"
        :class="{ 'bg-neutral-500/10': listStore.selectedMap === map }"
        @click="() => listStore.selectMap(map)"
    >
        <UCheckbox size="lg" />

        <div>
            <div
                class="bg-primary-500/30"
                :style="{ width: chartWidth }"
                v-if="timeReportStore.showReport && chartWidth !== undefined"
            >
                <!-- Text intentionally overflows the boxes -->
                <span class="font-mono text-sm">
                    {{ mapDisplayNames.get(map) }}
                </span>
            </div>
            <div v-else>
                <span class="font-mono text-sm">
                    {{ mapDisplayNames.get(map) }}
                </span>
            </div>
        </div>

        <div v-if="!timeReportStore.showReport" class="grid grid-cols-subgrid col-span-6">
            <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.VBsp" />
            <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.Post" />
            <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.VVis" />
            <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.VRad" />
            <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.Game" />
            <MapsDataGridProgressCell :map-path="map" :step="SharedMapCompileStep.Done" />
        </div>
        <div v-else class="grid grid-cols-subgrid col-span-6">
            <MapsDataGridTimeReportCell :map-path="map" :step="SharedMapCompileStep.VBsp" />
            <MapsDataGridTimeReportCell :map-path="map" :step="SharedMapCompileStep.VVis" />
            <MapsDataGridTimeReportCell :map-path="map" :step="SharedMapCompileStep.VRad" />
            <MapsDataGridTimeReportTotalCell :map-path="map" />
        </div>

        <MapsDataGridActionsCell :map-path="map" />
    </div>
</template>

<script setup lang="ts">
import { useMapListStore } from "../../../store/MapListStore.js";
import { filename } from "pathe/utils";
import pathe from "pathe";
import { computed } from "vue";
import MapsDataGridProgressCell from "./MapsDataGridProgressCell.vue";
import { SharedMapCompileStep } from "../../../../shared/SharedMapCompile.js";
import { useMapTimeReportStore } from "../../../store/MapTimeReportStore.js";
import MapsDataGridTimeReportCell from "./MapsDataGridTimeReportCell.vue";
import MapsDataGridTimeReportTotalCell from "./MapsDataGridTimeReportTotalCell.vue";
import MapsDataGridActionsCell from "./MapsDataGridActionsCell.vue";

const listStore = useMapListStore();
const timeReportStore = useMapTimeReportStore();

const props = defineProps<{ map: string }>();

const chartWidth = computed(() => {
    const percentage = timeReportStore.reportChart?.get(props.map);
    if (percentage === undefined) return undefined;

    return `${percentage}%`;
});

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
