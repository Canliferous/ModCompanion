<template>
    <div class="flex items-center gap-1">
        <UIcon name="tdesign:combination-filled" />
        <div class="text-sm font-mono text-ellipsis overflow-hidden text-left" dir="rtl">{{ name }}</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    name: string;
}>();
</script>

<style scoped></style>
