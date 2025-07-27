<template>
    <span>{{ name }}</span>
    <UButtonGroup>
        <UInput v-model="file" placeholder="Enter path" @blur="emit('updated', file)" class="grow" />
        <UButton icon="tdesign:play" @click="handleRun" variant="subtle" />
    </UButtonGroup>
</template>

<script setup lang="ts">
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";

const props = defineProps<{ file: string; name: string }>();
const file = ref(props.file);
watch(
    () => props.file,
    (val) => {
        file.value = val;
    },
);

const emit = defineEmits<{ updated: [newText: string] }>();

function handleRun() {
    const p = pathe.join(getAppConfig().rootPath, file.value);
    window.electronAPI.app.openFile(p);
}
</script>

<style scoped></style>
