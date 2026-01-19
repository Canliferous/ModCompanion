<template>
    <UCheckbox v-model="timeReportStore.showReport" label="Time Report" variant="button" @change="onToggle" />
</template>

<script setup lang="ts">
import { useMapTimeReportStore } from "~/store/MapTimeReportStore.js";

const timeReportStore = useMapTimeReportStore();

function onToggle() {
    if (timeReportStore.showReport) {
        timeReportStore.createTimeReport();
    }
}
</script>

<style scoped></style>
