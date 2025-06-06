<template>
    <div
        v-show="consoleStore.isOpen"
        class="w-100 bg-secondary/10 border-secondary-800 border-1"
        id="maps-log-container"
    >
        <MonacoEditor :options="options" theme="vs-dark" />
    </div>
</template>

<script setup lang="ts">
import { useMapConsoleStore } from "../../../store/MapConsoleStore.js";
import MonacoEditor from "monaco-editor-vue3";

const consoleStore = useMapConsoleStore();
const options = {
    automaticLayout: true,
};
</script>

<style scoped></style>
