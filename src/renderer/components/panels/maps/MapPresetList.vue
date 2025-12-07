<template>
    <div v-for="[key, name] in displayNames.entries()" class="text-xs text-muted">{{ name }}</div>
</template>
<script setup lang="ts">
import { useMapDisplayNames } from "~/composables/useMapDisplayNames.js";

const props = defineProps<{ maps: string[] }>();

const displayNames = computed(() => useMapDisplayNames(props.maps));
</script>

<style scoped></style>
