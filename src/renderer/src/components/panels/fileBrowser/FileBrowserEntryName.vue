<template>
    <span class="text-ellipsis overflow-clip">{{ name }}</span>
</template>

<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<style scoped></style>
