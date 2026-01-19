<template>
    <UCheckbox v-model="checked" :label="flag" @change="emit('toggle', flag)" />
</template>

<script setup lang="ts">
import { SharedVtfFlag } from "Shared/vtf/SharedVtfFlag.js";

const emit = defineEmits<{ toggle: [flag: SharedVtfFlag] }>();
const props = defineProps<{ flag: SharedVtfFlag; checked: boolean }>();
const checked = ref(props.checked);
watch(
    () => props.checked,
    (v) => {
        checked.value = v;
    },
);
</script>

<style scoped></style>
