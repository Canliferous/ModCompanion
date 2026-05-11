<template>
    <MInteractiveImageViewer :src="`file://${path}`" />
</template>

<script setup lang="ts">
import MInteractiveImageViewer from "~/components/common/MInteractiveImageViewer.vue";

defineProps<{ path: string }>();
</script>

<style scoped></style>
