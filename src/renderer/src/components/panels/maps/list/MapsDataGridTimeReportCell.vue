<template>
    <span v-if="seconds !== undefined" class="text-center text-xs text-neutral-400">{{ seconds }}s</span>
    <span v-else />
</template>

<script setup lang="ts">
import { useMapTimeReportStore } from "~/store/MapTimeReportStore.js";
import { computed } from "vue";
import * as Shared from "mod_companion_shared";

const props = defineProps<{ mapPath: string; step: Shared.Map.CompileStep }>();
const key = props.mapPath + props.step;

const timeReportStore = useMapTimeReportStore();

const seconds = computed(() => {
    return timeReportStore.report?.maps.get(key);
});
</script>

<style scoped></style>
