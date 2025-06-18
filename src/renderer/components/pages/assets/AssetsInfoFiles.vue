<script setup lang="ts">
import AssetsInfoFilesItem from "~/components/pages/assets/AssetsInfoFilesItem.vue";

const props = defineProps<{ color: string; files: string[]; header: string; filesRoot: string }>();
</script>

<template>
    <div>
        <p :class="`bg-${color}-500 text-${color}-950 p-1 text-xs font-bold uppercase`">{{ header }}</p>
        <div class="py-1">
            <span v-if="files.length === 0" class="text-center text-sm text-neutral-400">None</span>

            <AssetsInfoFilesItem v-for="file in files" :file="file" :files-root="filesRoot" />
        </div>
    </div>
</template>

<style scoped></style>
