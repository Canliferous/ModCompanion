<template>
    <MTextArea horiz-scroll>{{ info }}</MTextArea>
</template>

<script setup lang="ts">
import { SharedMdlInfoReport } from "Shared/SharedMdlInfoReport.js";

const props = defineProps<{ path: string }>();

const info = ref<SharedMdlInfoReport | undefined>();

watch(
    () => props.path,
    (val) => window.electronAPI.mdl.info(val).then((r) => (info.value = r)),
);

window.electronAPI.mdl.info(props.path).then((r) => (info.value = r));
</script>

<style scoped></style>
