<template>
    <div class="grid h-full place-items-center text-muted">
        Under maintenance
        <!--        <TexturePreview v-if="meta.data" :data="meta.data" />-->
        <!--        <TexturePreview v-if="meta.data" :data="meta.data" />-->
        <!--        <TexturePreview v-if="meta.data" :data="meta.data" />-->
        <!--        <TexturePreview v-if="meta.data" :data="meta.data" />-->
    </div>
</template>

<script setup lang="ts">
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";

const props = defineProps<{ meta: SharedImageMetaReport }>();
</script>

<style scoped></style>
