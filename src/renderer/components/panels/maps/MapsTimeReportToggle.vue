<template>
    <UCheckbox label="Time Report" variant="button" v-model="timeReportStore.showReport" @change="onToggle" />
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
