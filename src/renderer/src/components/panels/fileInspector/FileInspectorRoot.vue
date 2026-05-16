<template>
    <MPanelRoot>
        <template #header>
            <div class="grid gap-2 grid-cols-2 items-start justify-items-end">
                <div class="flex gap-2 w-full items-center">
                    <UIcon class="size-10 text-blue-300" :name="getFileTypeIcon(fileType)" />
                    <div class="grow shrink select-none">
                        <div>{{ fileName }}</div>
                        <div v-if="entry?.fileSize !== undefined" class="text-sm tabular-nums flex gap-2">
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
        <div class="grid grid-cols-1 grid-rows-1 gap-2 h-full">
            <component :is="getFileInspectorComponent(fileInspector)" :path="fullPath" />
        </div>
    </MPanelRoot>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import {
    FileInspectors,
    getFileInspectorComponent,
    getFileInspectorFromType,
    getFileType,
    getFileTypeIcon,
    getFileTypeName,
} from "~/helper/FileInspectorHelper.js";
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import * as Shared from "mod_companion_shared";
import { fileSize } from "humanize-plus";
import { computedAsync } from "@vueuse/core";

const props = defineProps<{ file: string }>();
const fullPath = computed(() => pathe.join(getAppConfig().rootPath, props.file));
const fileName = computed(() => pathe.basename(props.file));
const fileType = computed(() => getFileType(fileName.value));
const fileInspector = computed(() => getFileInspectorFromType(fileType.value));

const entry = computedAsync(
    () => window.electronAPI.fileBrowser.getFileEntry(props.file, Shared.FileBrowser.PathBases.RootRelative),
    undefined,
);

function handleExplore() {
    if (fullPath.value) {
        window.electronAPI.fileBrowser.browseToFile(fullPath.value);
    }
}

function handleOpen() {
    if (fullPath.value) {
        window.electronAPI.fileBrowser.open(fullPath.value);
    }
}
</script>

<style scoped></style>
