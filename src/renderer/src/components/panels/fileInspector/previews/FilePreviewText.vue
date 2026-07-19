<template>
    <MTextArea horiz-scroll>{{ text }}</MTextArea>
</template>

<script setup lang="ts">
import { computedAsync } from "@vueuse/core";

const props = defineProps<{ path: string }>();

const text = computedAsync(() => window.electronAPI.file.readString(props.path), "");
</script>

<style scoped></style>
