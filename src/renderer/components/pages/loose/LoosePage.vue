<template>
    <div class="border border-accented max-w-90">
        <div class="border-b border-b-accented"><FsPathField /></div>
        <div class="grid grid-cols-[auto_1fr_auto]">
            <FsListItem v-for="entry in looseFilesStore.currentEntries" :entry="entry" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { useLooseFilesStore } from "~/store/LooseFilesStore.js";
import FsPathField from "~/components/pages/loose/list/FsPathField.vue";

const looseFilesStore = useLooseFilesStore();
</script>

<style scoped></style>
