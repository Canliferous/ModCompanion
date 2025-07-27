<template>
    <div class="grid grid-cols-2 grid-rows-2 max-h-full">
        <TexturePreview v-if="meta.channels?.redData" :data="meta.channels?.redData" />
        <div v-else />
        <TexturePreview v-if="meta.channels?.greenData" :data="meta.channels?.greenData" />
        <div v-else />
        <TexturePreview v-if="meta.channels?.blueData" :data="meta.channels?.blueData" />
        <div v-else />
        <TexturePreview v-if="meta.channels?.alphaData" :data="meta.channels?.alphaData" />
        <div v-else />
    </div>
</template>

<script setup lang="ts">
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";

const props = defineProps<{ meta: SharedImageMetaReport }>();
</script>

<style scoped></style>
