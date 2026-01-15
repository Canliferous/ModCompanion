<template>
    <MPanelRoot>
        <div v-if="entry" class="grid gap-2">
            <div class="flex gap-2 w-full items-center">
                <UIcon class="size-10 text-blue-300" :name="AppDesign.Icons.FsFile" />
                <div class="grow shrink select-none">
                    <div>{{ entry.name }}</div>
                    <div v-if="entry.fileSize !== undefined" class="tabular-nums">
                        {{ fileSize(entry.fileSize) }}
                    </div>
                </div>
            </div>

            <div class="flex gap-2">
                <UButton size="xs" @click="handleOpen" label="Open" :icon="AppDesign.Icons.ActionLaunchFile" />
                <UButton
                    size="xs"
                    @click="handleExplore"
                    label="Explore to"
                    :icon="AppDesign.Icons.ActionBrowseToFolder"
                />
            </div>

            <USeparator />

            <div>{{ fileType }}</div>

            <template v-if="fileType === FileType.Image">
                <FileInspectorImagePreview :path="entry.path" />
            </template>
        </div>
    </MPanelRoot>
</template>

<script setup lang="ts">
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";
import { fileSize } from "humanize-plus";
import { AppDesign } from "~/design/AppDesign.js";
import { FileType, getFileType } from "~/components/panels/fileInspector/FileInspectorHelper.js";

const fileBrowserStore = useFileBrowserStore();
const entry = computed(() => fileBrowserStore.activeEntry);

const fileType = computed(() => (entry.value ? getFileType(entry.value?.name) : FileType.Unknown));

function handleExplore() {
    if (entry.value?.path) {
        window.electronAPI.fileBrowser.browseToFile(entry.value.path);
    }
}

function handleOpen() {
    if (entry.value?.path) {
        window.electronAPI.fileBrowser.launchFile(entry.value.path);
    }
}
</script>

<style scoped></style>
