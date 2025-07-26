<template>
    <div class="text-sm font-mono text-neutral-300 text-ellipsis overflow-hidden text-left" dir="rtl">
        &lrm;{{ name }}
    </div>
</template>

<script setup lang="ts">
defineProps<{ name: string }>();
</script>

<style scoped></style>
