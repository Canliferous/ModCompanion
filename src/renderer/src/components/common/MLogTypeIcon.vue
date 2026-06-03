<template>
    <UIcon class="shrink-0" :name="getLogTypeIcon(type)" :class="getLogTypeTextColor(type)" />
</template>

<script setup lang="ts">
import { getLogTypeIcon, getLogTypeTextColor } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";

defineProps<{ type: Shared.Log.Type }>();
</script>

<style scoped></style>
