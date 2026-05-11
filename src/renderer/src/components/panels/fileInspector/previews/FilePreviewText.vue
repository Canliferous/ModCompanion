<template>
    <MTextArea horiz-scroll>{{ text }}</MTextArea>
</template>

<script setup lang="ts">
const props = defineProps<{ path: string }>();

const text = ref("");

watch(
    () => props.path,
    (val) => window.electronAPI.file.readString(val).then((r) => (text.value = r)),
);

window.electronAPI.file.readString(props.path).then((r) => (text.value = r));
</script>

<style scoped></style>
