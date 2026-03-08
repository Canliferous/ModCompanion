<template>
    <UIcon :name="getLogTypeIcon(type)" :class="getLogTypeTextColor(type)" />
</template>

<script setup lang="ts">
import { SharedLogType } from "Shared/SharedLogger.js";
import { getLogTypeIcon, getLogTypeTextColor } from "~/design/AppDesign.js";

defineProps<{ type: SharedLogType }>();
</script>

<style scoped></style>
