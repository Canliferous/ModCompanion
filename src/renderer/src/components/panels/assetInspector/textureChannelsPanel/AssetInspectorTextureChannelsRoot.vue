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
import * as Shared from "mod_companion_shared";

defineProps<{ meta: Shared.ImageMeta.SharedImageMetaReport }>();
</script>

<style scoped></style>
