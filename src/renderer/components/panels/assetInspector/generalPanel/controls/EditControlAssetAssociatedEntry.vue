<template>
    <div class="flex gap-2 items-center">
        <UIcon :name="entry.icon" />
        <span>{{ entry.name }}</span>
    </div>
    <div ref="dropZoneRef">
        <UButtonGroup class="w-full">
            <UInput
                v-model="file"
                placeholder="Enter path"
                @change="emit('updated', file)"
                variant="outline"
                class="grow"
                :highlight="isOverDropZone"
            />
            <UButton icon="tdesign:play" @click="handleRun" variant="subtle" color="neutral" />
        </UButtonGroup>
    </div>
</template>

<script setup lang="ts">
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import { SharedAssetDefinitionAssociatedFilesEntry } from "Shared/SharedAssetDefinition.js";
import { useDropZone } from "@vueuse/core";

const props = defineProps<{ file: string; entry: SharedAssetDefinitionAssociatedFilesEntry }>();
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

const dropZoneRef = ref<HTMLDivElement>();
async function onDrop(files: File[] | null) {
    if (files === null || files.length !== 1) return;

    const fullPath = window.electronAPI.webUtils.getPathForFile(files[0]);
    const correctPath = await window.electronAPI.project.correctPath(fullPath);
    if (correctPath) {
        file.value = correctPath;
        emit("updated", correctPath);
    }
}
const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    preventDefaultForUnhandled: false,
});
</script>

<style scoped></style>
