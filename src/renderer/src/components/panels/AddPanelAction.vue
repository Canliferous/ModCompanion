<template>
    <AddPanelActionRoot :params="params" />
</template>

<script setup lang="ts">
import AddPanelActionRoot from "~/components/panels/AddPanelActionRoot.vue";

defineProps<{ params: any }>();
</script>

<style scoped></style>
