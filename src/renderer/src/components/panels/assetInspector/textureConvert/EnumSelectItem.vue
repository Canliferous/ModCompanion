<template>
    <UButton
        :label="label"
        variant="ghost"
        :color="isSelected ? 'primary' : 'neutral'"
        :icon="isSelected ? AppDesign.Icons.Check : 'nothing'"
        :disabled="disabled"
        @click="() => emit('click', entry)"
    />
</template>

<script setup lang="ts" generic="T">
import { AppDesign } from "~/design/AppDesign.js";

const props = defineProps<{
    entry: T;
    labelFunc?: (v: T) => string;
    default?: T;
    isSelected: boolean;
    disabled?: boolean;
}>();
const emit = defineEmits<{
    click: [entry: T];
}>();
const label = computed(() => {
    let name: string;
    if (props.labelFunc) {
        name = props.labelFunc(props.entry);
    } else {
        name = (props.entry as object).toString();
    }

    if (props.default === props.entry) {
        name += " (Default)";
    }

    return name;
});
</script>

<style scoped></style>
