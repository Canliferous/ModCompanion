<template>
    <div
        class="border border-neutral-925 border-b-neutral-950 border-r-neutral-950 rounded shadow-sm shadow-neutral-950"
    >
        <div class="flex bg-neutral-800 rounded-t-md inset-shadow-rim border-b border-b-neutral-925">
            <span class="text-xs px-3 py-1 select-none">
                {{ heading }}
            </span>
        </div>
        <div class="p-1 grid gap-1 content-start">
            <slot name="default" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ heading: string }>();
</script>

<style scoped></style>
