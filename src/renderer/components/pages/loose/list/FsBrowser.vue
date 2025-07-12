<template>
    <div class="grid grid-rows-[auto_auto_1fr] h-full w-130">
        <div><FsPathField /></div>
        <USeparator />
        <div class="overflow-y-auto">
            <div class="grid grid-cols-[auto_1fr_auto]">
                <FsListItem v-for="entry in looseFilesStore.currentEntries" :entry="entry" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import FsPathField from "~/components/pages/loose/list/FsPathField.vue";
import { useLooseFilesStore } from "~/store/LooseFilesStore.js";
const looseFilesStore = useLooseFilesStore();
</script>

<style scoped></style>
