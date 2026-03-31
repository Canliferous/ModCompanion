<template>
    <MFilePathInput v-model="text" @change="emit('changed', text)">
        <UButton size="sm" variant="link" :icon="AppDesign.Icons.ActionRemove" @click="emit('remove')" />
    </MFilePathInput>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";

const props = defineProps<{ entry: string; dir: string }>();
const text = ref(props.entry);
watch(
    () => props.entry,
    (val) => {
        text.value = val;
    },
);

const emit = defineEmits<{
    remove: [void];
    changed: [newVal: string];
}>();
</script>

<style scoped></style>
