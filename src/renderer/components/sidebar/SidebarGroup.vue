<template>
    <div class="bg-neutral-850 inset-shadow-rim rounded shadow-sm p-1">
        <div class="flex">
            <span class="text-xs text-neutral-200 px-3 pb-2 pt-1 select-none">
                {{ heading }}
            </span>
        </div>
        <div class="grid gap-1 content-start">
            <slot name="default" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ heading: string }>();
</script>

<style scoped></style>
