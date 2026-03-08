<template>
    <UCheckbox v-model="checked" :label="flag" @change="emit('toggle', flag)" />
</template>

<script setup lang="ts">
import * as Shared from "mod_companion_shared";

const emit = defineEmits<{ toggle: [flag: Shared.Vtf.SharedVtfFlag] }>();
const props = defineProps<{ flag: Shared.Vtf.SharedVtfFlag; checked: boolean }>();
const checked = ref(props.checked);
watch(
    () => props.checked,
    (v) => {
        checked.value = v;
    },
);
</script>

<style scoped></style>
