<template>
    <div class="flex items-center h-full gap-1">
        <UIcon v-if="props.params.icon" :name="props.params.icon" />
        <span>{{ props.params.name }}</span>
    </div>
</template>

<script setup lang="ts">
import { IDockviewPanelHeaderProps } from "dockview-vue";
import { SubPanelParams } from "~/helper/GlobalComponents.js";

const p = defineProps<{ props: IDockviewPanelHeaderProps<SubPanelParams> }>();
</script>

<style scoped></style>
