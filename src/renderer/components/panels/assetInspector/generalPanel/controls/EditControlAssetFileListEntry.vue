<template>
    <div class="flex gap-1">
        <UInput v-model="text" class="grow" :placeholder @change="emit('changed', text)" />

        <UButtonGroup class="flex">
            <UButton :icon="AppDesign.Icons.ActionExploreToFolder" @click="handleExplore" />
            <UButton :icon="AppDesign.Icons.ActionRemove" @click="emit('remove')" />
        </UButtonGroup>
    </div>
</template>

<script setup lang="ts">
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
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

const placeholder = `Enter path...`;

function handleExplore() {
    const p = pathe.join(getAppConfig().rootPath, props.dir, getAppConfig().gameName, text.value);
    window.electronAPI.app.browseToFile(p);
}
</script>

<style scoped></style>
