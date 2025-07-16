<template>
    <div class="h-full grid grid-cols-[auto_auto_1fr]">
        <FsBrowser />
        <USeparator orientation="vertical" class="mx-1" />
        <div>
            <FsInspector />
        </div>
    </div>
</template>
<script setup lang="ts">
import FsBrowser from "~/components/pages/loose/list/FsBrowser.vue";
import FsInspector from "~/components/pages/loose/inspector/FsInspector.vue";
</script>

<style scoped></style>
