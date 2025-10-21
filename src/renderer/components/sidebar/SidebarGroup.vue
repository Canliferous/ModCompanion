<template>
    <div class="bg-neutral-850 inset-shadow-rim rounded shadow-sm p-1">
        <div class="flex items-start pl-3 pr-1 pb-1 pt-1">
            <span class="text-xs text-neutral-200 select-none grow">
                {{ heading }}
            </span>

            <slot name="hint" />
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
