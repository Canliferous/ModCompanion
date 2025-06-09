<template>
    <span class="text-center text-xs text-neutral-400" v-show="seconds !== undefined">{{ seconds }}s</span>
</template>

<script setup lang="ts">
import { SharedMapCompileStep } from "../../../../shared/SharedMapCompile.js";
import { useMapTimeReportStore } from "../../../store/MapTimeReportStore.js";
import { computed } from "vue";

const props = defineProps<{ mapPath: string; step: SharedMapCompileStep }>();
const key = props.mapPath + props.step;

const timeReportStore = useMapTimeReportStore();

const seconds = computed(() => {
    return timeReportStore.report?.maps.get(key);
});
</script>

<style scoped></style>
