<template>
    <div class="border border-accented">
        <p class="text-xs px-3 py-1 select-none bg-neutral-800 border-b border-b-accented">
            {{ heading }}
        </p>
        <div class="p-1 grid gap-1 content-start">
            <slot name="default" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ heading: string }>();
</script>

<style scoped></style>
