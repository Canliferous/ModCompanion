<template>
    <div class="flex gap-2 items-center">
        <UIcon :name="entry.icon" />
        <span>{{ entry.name }}</span>
    </div>
    <div ref="dropZoneRef">
        <div class="flex items-center w-full gap-1">
            <MDropInput v-model="file" placeholder="Enter path" @change="emit('updated', file)" class="grow" />
            <UButton icon="tdesign:play" @click="handleRun" :disabled="file.length === 0" />
        </div>
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
</script>

<style scoped></style>
