<template>
    <div class="bg-primary-500/30" :class="{ 'text-neutral-500': chartWidth === '0%' }" :style="{ width: chartWidth }">
        <!-- Text intentionally overflows the boxes -->
        <span class="font-mono text-sm">
            {{ displayName }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { useMapTimeReportStore } from "~/store/MapTimeReportStore.js";

const timeReportStore = useMapTimeReportStore();

const props = defineProps<{ mapPath: string; displayName: string }>();

const chartWidth = computed(() => {
    const percentage = timeReportStore.reportChart?.get(props.mapPath);
    if (percentage === undefined) return "0%";

    return `${percentage}%`;
});
</script>

<style scoped></style>
