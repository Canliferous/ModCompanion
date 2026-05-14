<template>
    <SubPanelTabRoot :props="params" />
</template>

<script setup lang="ts">
import SubPanelTabRoot from "~/components/panelTabs/SubPanelTabRoot.vue";
import { IDockviewPanelHeaderProps } from "dockview-vue";

defineProps<{ params: IDockviewPanelHeaderProps }>();
</script>

<style scoped></style>
