<template>
    <MPanelRoot>
        <template #header>
            <div v-if="entry" class="grid gap-2">
                <div class="flex gap-2 w-full items-center">
                    <UIcon class="size-10 text-blue-300" :name="getFileTypeIcon(fileType)" />
                    <div class="grow shrink select-none">
                        <div>{{ entry.name }}</div>
                        <div v-if="entry.fileSize !== undefined" class="text-sm tabular-nums flex gap-2">
                            <span>{{ fileSize(entry.fileSize) }}</span>
                            <span>{{ getFileTypeName(fileType) }}</span>
                        </div>
                    </div>
                </div>

                <div class="flex gap-2">
                    <UButton
                        v-if="fileInspector === FileInspectors.Text"
                        size="xs"
                        label="Edit"
                        :icon="AppDesign.Icons.ActionEdit"
                        @click="handleOpen"
                    />
                    <UButton
                        v-else
                        size="xs"
                        label="Open"
                        :icon="AppDesign.Icons.ActionLaunchFile"
                        @click="handleOpen"
                    />
                    <UButton
                        size="xs"
                        label="Explore to"
                        :icon="AppDesign.Icons.ActionBrowseToFolder"
                        @click="handleExplore"
                    />
                </div>
            </div>
        </template>
        <div v-if="entry" class="grid gap-2 h-full">
            <component :is="getFileInspectorComponent(fileInspector)" :path="fullPath" />
        </div>
        <div v-else class="grid h-full place-items-center text-muted">No file selected</div>
    </MPanelRoot>
</template>

<script setup lang="ts">
import { useFileBrowserStore } from "~/store/FileBrowserStore.js";
import { fileSize } from "humanize-plus";
import { AppDesign } from "~/design/AppDesign.js";
import {
    FileInspectors,
    FileType,
    getFileInspectorComponent,
    getFileInspectorFromType,
    getFileType,
    getFileTypeIcon,
    getFileTypeName,
} from "~/components/panels/fileInspector/FileInspectorHelper.js";
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import FileInspectorTextPreview from "~/components/panels/fileInspector/FileInspectorTextPreview.vue";

const fileBrowserStore = useFileBrowserStore();
const entry = computed(() => (fileBrowserStore.activeEntry?.isFile ? fileBrowserStore.activeEntry : undefined));
const fullPath = computed(() => (entry.value ? pathe.join(getAppConfig().rootPath, entry.value?.path) : ""));

const fileType = computed(() => (entry.value ? getFileType(entry.value?.name) : FileType.Unknown));
const fileInspector = computed(() => getFileInspectorFromType(fileType.value));

function handleExplore() {
    if (fullPath.value) {
        window.electronAPI.fileBrowser.browseToFile(fullPath.value);
    }
}

function handleOpen() {
    if (fullPath.value) {
        window.electronAPI.fileBrowser.openFile(fullPath.value);
    }
}
</script>

<style scoped></style>
