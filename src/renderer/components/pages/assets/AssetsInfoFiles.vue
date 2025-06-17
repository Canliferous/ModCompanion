<script setup lang="ts">
const props = defineProps<{ color: string; files: string[]; header: string }>();
</script>

<template>
    <div :class="`border border-${color}-500 border-t-0`">
        <p :class="`bg-${color}-500 text-${color}-950 p-1 text-xs font-bold uppercase`">{{ header }}</p>
        <ul class="p-1">
            <li v-if="files.length === 0" class="text-center text-sm text-neutral-400">None</li>
            <li v-for="file in files" class="font-mono text-sm text-neutral-200">
                {{ file }}
            </li>
        </ul>
    </div>
</template>

<style scoped></style>
