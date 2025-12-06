<template>
    <MPanelRoot>
        <MLogArea :text="log" />
    </MPanelRoot>
</template>

<script setup lang="ts">
import { useMapListStore } from "~/store/MapListStore.js";
import { useMapConsoleStore } from "~/store/MapConsoleStore.js";
import { computed, useTemplateRef, watch } from "vue";
import { useRememberRef } from "~/composables/useRemember.js";

const listStore = useMapListStore();
const consoleStore = useMapConsoleStore();

const logOutput = useTemplateRef("logOutput");
// const lineWrap = useRememberRef(ref(false), "map-compile-log-line-wrap");

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
