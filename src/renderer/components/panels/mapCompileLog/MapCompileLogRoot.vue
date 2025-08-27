<template>
    <div class="p-1 h-full grid grid-rows-[auto_minmax(0,_1fr)]">
        <div class="flex">
            <div class="ml-auto" />
            <UCheckbox v-model="lineWrap" label="Line Wrap" />
        </div>
        <div
            class="p-2 font-mono text-xs text-neutral-300 overflow-y-scroll text-nowrap wrap-anywhere"
            :class="{ 'text-wrap': lineWrap }"
            ref="logOutput"
        >
            {{ log }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMapListStore } from "~/store/MapListStore.js";
import { useMapConsoleStore } from "~/store/MapConsoleStore.js";
import { computed, useTemplateRef, watch } from "vue";
import { useRememberRef } from "~/composables/useRemember.js";

const listStore = useMapListStore();
const consoleStore = useMapConsoleStore();

const logOutput = useTemplateRef("logOutput");
const lineWrap = useRememberRef(ref(false), "map-compile-log-line-wrap");

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
