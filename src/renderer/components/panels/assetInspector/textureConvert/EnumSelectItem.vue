<template>
    <UButton
        :label="label"
        variant="ghost"
        :color="isSelected ? 'primary' : 'neutral'"
        :icon="isSelected ? 'tdesign:check' : 'nothing'"
        @click="() => emit('click', entry)"
    />
</template>

<script setup lang="ts" generic="T">
const props = defineProps<{
    entry: T;
    labelFunc?: (v: T) => string;
    default?: T;
    isSelected: boolean;
}>();
const emit = defineEmits<{
    click: [entry: T];
}>();
const label = computed(() => {
    let name: string;
    if (props.labelFunc) {
        name = props.labelFunc(props.entry);
    } else {
        name = (props.entry as Object).toString();
    }

    if (props.default === props.entry) {
        name += " (Default)";
    }

    return name;
});
</script>

<style scoped></style>
