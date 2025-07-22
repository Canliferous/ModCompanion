<template>
    <div class="text-sm font-mono text-neutral-300">
        {{ name }}
    </div>
</template>

<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<style scoped></style>
