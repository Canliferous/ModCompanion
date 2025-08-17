<template>
    <div class="p-1 h-full">
        <div class="p-2 h-full font-mono text-xs text-neutral-300 overflow-auto" ref="logOutput">
            <pre>
                {{ log }}
            </pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMapListStore } from "~/store/MapListStore.js";
import { useMapConsoleStore } from "~/store/MapConsoleStore.js";
import { computed, useTemplateRef, watch } from "vue";

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
