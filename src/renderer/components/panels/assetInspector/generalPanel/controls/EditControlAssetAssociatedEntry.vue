<template>
    <div class="flex gap-2 items-center">
        <UIcon :name="entry.icon" />
        <span>{{ entry.name }}</span>
    </div>
    <div ref="dropZoneRef">
        <div class="flex items-center w-full gap-1">
            <MDropInput v-model="file" placeholder="Enter path" class="grow" @change="emit('updated', file)" />
            <UButton :icon="AppDesign.Icons.ActionPlay" :disabled="file.length === 0" @click="handleRun" />
        </div>
    </div>
</template>

<script setup lang="ts">
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import { SharedAssetDefinitionAssociatedFilesEntry } from "Shared/SharedAssetDefinition.js";
import { AppDesign } from "~/design/AppDesign.js";

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
    window.electronAPI.fileBrowser.openFile(p);
}
</script>

<style scoped></style>
