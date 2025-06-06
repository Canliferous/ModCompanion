<template>
    <UButton
        :leading-icon="consoleStore.isOpen ? 'tdesign:chevron-up' : 'tdesign:chevron-down'"
        color="secondary"
        variant="subtle"
        label="Output"
        @click="consoleStore.toggleOpen()"
    />
</template>

<script setup lang="ts">
import { useMapConsoleStore } from "../../../store/MapConsoleStore.js";

const consoleStore = useMapConsoleStore();
</script>

<style scoped></style>
