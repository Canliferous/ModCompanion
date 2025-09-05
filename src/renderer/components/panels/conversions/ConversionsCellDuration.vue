<template>
    <UTooltip :text="`Took ${displayTime} to finish`">
        <div>{{ displayTime }}</div>
    </UTooltip>
</template>

<script setup lang="ts">
import { floor } from "lodash";

const props = defineProps<{
    startTime: Date;
    endTime: Date;
}>();

const displayTime = computed(() => {
    const delta = props.endTime.getTime() - props.startTime.getTime();
    return `${floor(delta)}ms`;
});
</script>

<style scoped></style>
