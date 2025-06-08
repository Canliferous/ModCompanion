<template>
    <UButton
        :leading-icon="drawerStore.isOpen ? 'tdesign:chevron-up' : 'tdesign:chevron-down'"
        color="success"
        variant="subtle"
        label="Browse"
        @click="drawerStore.toggleOpen()"
    />
</template>

<script setup lang="ts">
import { useMapDrawerStore } from "../../../store/MapDrawerStore.js";

const drawerStore = useMapDrawerStore();
</script>

<style scoped></style>
