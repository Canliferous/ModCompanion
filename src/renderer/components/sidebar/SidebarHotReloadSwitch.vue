<template>
    <UButton
        size="sm"
        color="neutral"
        label="Auto Hot Reload"
        :icon="enabled ? 'tdesign:check-rectangle-filled' : 'tdesign:rectangle'"
        variant="ghost"
        @click="enabled = !enabled"
    />
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
