<template>
    <UTooltip :text="dateTime.toString()">
        <time class="tabular-nums text-xs text-muted">{{ displayedTime }}</time>
    </UTooltip>
</template>

<script setup lang="ts">
const props = defineProps<{ dateTime: Date }>();

const displayedTime = computed(() => {
    const secs = props.dateTime.getSeconds().toString(10).padStart(2, "0");
    const mins = props.dateTime.getMinutes().toString(10).padStart(2, "0");
    const hours = props.dateTime.getHours().toString(10).padStart(2, "0");

    return `${hours}:${mins}:${secs}`;
});
</script>

<style scoped></style>
