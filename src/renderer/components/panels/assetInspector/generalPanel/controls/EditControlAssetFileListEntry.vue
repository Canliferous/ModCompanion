<template>
    <div class="flex">
        <UInput v-model="text" variant="ghost" class="grow" :placeholder @change="emit('changed', text)" />
        <UButton variant="ghost" icon="tdesign:folder-1" color="info" @click="handleExplore" />
        <UButton variant="ghost" icon="tdesign:minus" color="error" @click="emit('remove')" />
    </div>
</template>

<script setup lang="ts">
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";

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

const placeholder = `Enter path...`;

function handleExplore() {
    const p = pathe.join(getAppConfig().rootPath, props.dir, getAppConfig().gameName, text.value);
    window.electronAPI.app.browseToFile(p);
}
</script>

<style scoped></style>
