<template>
    <MAcceptDrop v-model="model" @change="emit('change', model ?? '')">
        <template #default="{ isOverDropZone }">
            <div
                class="flex rounded bg-neutral-900 border border-accented inset-shadow-cave overflow-hidden hover:bg-neutral-850"
                :dir="isDragging ? 'rtl' : 'ltr'"
            >
                <template v-if="isDragging">
                    <MDropAreaBg
                        class="px-2.5 py-1.5 text-center transition-colors"
                        :class="{ 'bg-neutral-800': isOverDropZone }"
                    >
                        Drop Here
                    </MDropAreaBg>
                </template>
                <template v-else>
                    <UInput
                        v-model="model"
                        :placeholder="placeholder ?? 'Choose or drop file...'"
                        class="w-full"
                        variant="none"
                        size="sm"
                        @change="emit('change', model ?? '')"
                    />
                    <UButton
                        :icon="AppDesign.Icons.ActionBrowseToFolder"
                        size="sm"
                        variant="link"
                        @click="handleBrowse"
                    />
                    <UButton
                        :icon="AppDesign.Icons.ActionLaunchFile"
                        size="sm"
                        variant="link"
                        class="mr-1"
                        @click="handleLaunch"
                    />
                    <slot name="default" />
                </template>
            </div>
        </template>
    </MAcceptDrop>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useGlobalDragging } from "~/composables/useGlobalDragging.js";
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";

const model = defineModel<string>({ required: false });
const emit = defineEmits<{ change: [string] }>();
defineProps<{ placeholder?: string }>();
const { isDragging } = useGlobalDragging();

const fullFilePath = computed(() => pathe.join(getAppConfig().rootPath, model.value ?? ""));

function handleBrowse(): void {
    window.electronAPI.fileBrowser.browseToFile(fullFilePath.value);
}

function handleLaunch(): void {
    window.electronAPI.fileBrowser.open(fullFilePath.value);
}
</script>

<style scoped></style>
