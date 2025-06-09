<template>
    <span class="text-center text-xs" v-show="totalSeconds !== undefined">{{ totalSeconds }}s</span>
</template>

<script setup lang="ts">
import { useMapTimeReportStore } from "../../../store/MapTimeReportStore.js";
import { computed } from "vue";

const props = defineProps<{ mapPath: string }>();

const timeReportStore = useMapTimeReportStore();

const totalSeconds = computed(() => timeReportStore.report?.totals.get(props.mapPath));
</script>

<style scoped></style>
