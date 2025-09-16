<template>
    <div class="flex items-center gap-1">
        <UIcon name="tdesign:combination-filled" />
        <div>{{ name }}</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    name: string;
}>();
</script>

<style scoped></style>
