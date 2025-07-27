<template>
    <!--    <div :style="`background-image: url(${base64ImageUrl(data)})`" class="bg-contain bg-no-repeat h-full w-full"></div>-->
    <img :src="base64ImageUrl(data)" class="max-h-full" />
</template>

<script setup lang="ts">
import { base64ImageUrl } from "~/helper/ImageHelper.js";

const props = defineProps<{ data: string }>();
</script>

<style scoped></style>
