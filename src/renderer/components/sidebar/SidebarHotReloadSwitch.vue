<template>
    <UCheckbox label="Auto Hot Reload" v-model="enabled" size="lg" />
</template>

<script setup lang="ts">
import { useRememberRef } from "~/composables/useRemember.js";

const enabled = useRememberRef(ref(true), "hot-reload-enabled");

window.electronAPI.hotReload.setEnabled(enabled.value);
watch(enabled, (on) => {
    window.electronAPI.hotReload.setEnabled(on);
});
</script>

<style scoped></style>
