<template>
    <UIcon class="shrink-0" :name="getLogTypeIcon(type)" :class="noColor ? '' : getLogTypeTextColor(type)" />
</template>

<script setup lang="ts">
import { getLogTypeIcon, getLogTypeTextColor } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";

defineProps<{ type: Shared.Log.Type; noColor?: boolean }>();
</script>

<style scoped></style>
