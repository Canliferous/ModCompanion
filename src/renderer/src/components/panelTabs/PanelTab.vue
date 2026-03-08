<template>
    <PanelTabRoot :params="params" />
</template>

<script setup lang="ts">
import PanelTabRoot from "~/components/panelTabs/PanelTabRoot.vue";
import { IDockviewPanelHeaderProps } from "dockview-vue";

defineProps<{ params: IDockviewPanelHeaderProps }>();
</script>

<style scoped></style>
