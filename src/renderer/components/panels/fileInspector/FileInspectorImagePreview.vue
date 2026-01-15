<template>
    <div>
        <img :src="`file://${pathe.join(getAppConfig().rootPath, path)}`" />
    </div>
</template>

<script setup lang="ts">
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";

const props = defineProps<{ path: string }>();
</script>

<style scoped></style>
