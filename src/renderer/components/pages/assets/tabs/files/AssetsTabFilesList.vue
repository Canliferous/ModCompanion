<script setup lang="ts">
import AssetsTabFilesListItem from "~/components/pages/assets/tabs/files/AssetsTabFilesListItem.vue";

defineProps<{ headerClass: string; files: string[]; header: string; filesRoot: string }>();
</script>

<template>
    <div>
        <p :class="`${headerClass} p-1 text-xs font-bold uppercase`">{{ header }}</p>
        <div class="py-1">
            <span v-if="files.length === 0" class="text-center text-sm text-neutral-400">None</span>

            <AssetsTabFilesListItem v-for="file in files" :file="file" :files-root="filesRoot" />
        </div>
    </div>
</template>

<style scoped></style>
