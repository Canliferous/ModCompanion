<template>
    <MPanelRoot noScroll>
        <template #header>
            <div class="grid gap-2" v-if="entry">
                <div class="flex gap-2 w-full items-center">
                    <UIcon class="size-10 text-blue-300" :name="AppDesign.Icons.FsFile" />
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
                        @click="handleOpen"
                        label="Edit"
                        :icon="AppDesign.Icons.ActionEdit"
                    />
                    <UButton
                        v-else
                        size="xs"
                        @click="handleOpen"
                        label="Open"
                        :icon="AppDesign.Icons.ActionLaunchFile"
                    />
                    <UButton
                        size="xs"
                        @click="handleExplore"
                        label="Explore to"
                        :icon="AppDesign.Icons.ActionBrowseToFolder"
                    />
                </div>
            </div>
        </template>
        <div v-if="entry" class="grid gap-2 h-full">
            <template v-if="fileInspector === FileInspectors.Image">
                <FileInspectorImagePreview :path="fullPath" />
            </template>

            <template v-if="fileInspector === FileInspectors.Text">
                <FileInspectorTextPreview :path="fullPath" />
            </template>
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
    getFileInspectorFromType,
    getFileType,
    getFileTypeName,
} from "~/components/panels/fileInspector/FileInspectorHelper.js";
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";

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
