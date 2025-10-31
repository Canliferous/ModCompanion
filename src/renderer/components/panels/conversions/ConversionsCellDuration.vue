<template>
    <template v-if="props.endTime">
        <UTooltip :text="`Took ${displayTime} to finish`">
            <div class="text-right">
                <span class="font-mono">{{ displayTime }}</span>
                <span>ms</span>
            </div>
        </UTooltip>
    </template>
    <template v-else>
        <div>...</div>
    </template>
</template>

<script setup lang="ts">
import { floor } from "lodash";

const props = defineProps<{
    startTime: Date;
    endTime?: Date;
}>();

const displayTime = computed(() => {
    if (!props.endTime) return undefined;
    const delta = props.endTime.getTime() - props.startTime.getTime();
    return floor(delta);
});
</script>

<style scoped></style>
