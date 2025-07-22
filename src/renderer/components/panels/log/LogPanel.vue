<template>
    <div
        v-show="consoleStore.isOpen"
        class="w-140 grid bg-secondary/10 border-secondary-800 border-1"
        id="maps-log-container"
    >
        <div class="p-2 h-full font-mono text-xs text-neutral-300 overflow-auto" ref="logOutput">
            {{ log }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watch, useTemplateRef } from "vue";
import { useMapConsoleStore } from "~/store/MapConsoleStore.js";
import { useMapListStore } from "~/store/MapListStore.js";

const listStore = useMapListStore();
const consoleStore = useMapConsoleStore();

const logOutput = useTemplateRef("logOutput");

const log = computed(() => {
    if (!listStore.selectedMap) {
        return undefined;
    }
    return consoleStore.logMessageTextMap.get(listStore.selectedMap);
});

watch(log, () => {
    if (logOutput.value) {
        logOutput.value.scrollTo(0, logOutput.value.scrollHeight);
    }
});
</script>

<style scoped></style>
