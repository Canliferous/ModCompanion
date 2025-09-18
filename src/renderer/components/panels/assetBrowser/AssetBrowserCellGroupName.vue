<template>
    <div class="flex items-center gap-1">
        <UIcon :name="AppDesign.icons.assetGroup" class="text-amber-400" />
        <div class="text-sm font-mono text-ellipsis overflow-hidden text-left" dir="rtl">{{ name }}</div>
    </div>
</template>

<script setup lang="ts">
import AppDesign from "~/design/AppDesign.js";

const props = defineProps<{
    name: string;
}>();
</script>

<style scoped></style>
