<template>
    <UFormField :label="heading" class="col-span-2" ref="dropZoneRef">
        <template #hint>
            <UButton
                icon="tdesign:plus"
                color="success"
                class="justify-self-end"
                @click="handleAdd"
                :disabled="reachedMax"
                size="xs"
            />
        </template>
        <div class="grid gap-1">
            <template v-for="(file, i) in files">
                <EditControlAssetFileListEntry
                    :entry="file"
                    @remove="() => handleRemove(i)"
                    @changed="(newText) => handleChanged(i, newText)"
                    :dir
                />
            </template>

            <DropArea v-if="files.length === 0" :drag-over="isOverDropZone" />
        </div>
    </UFormField>
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetDefinitionFileArrays } from "Shared/SharedAssetDefinition.js";
import EditControlAssetFileListEntry from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetFileListEntry.vue";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";
import { useDropZone } from "@vueuse/core";
import { getGameOrContentRelativePath } from "~/helper/SourceFs.js";
import DropArea from "~/components/common/DropArea.vue";

const props = defineProps<{
    asset: SharedAsset;
    field: keyof SharedAssetDefinitionFileArrays;
    dir: string;
    maxItems?: number;
    heading: string;
}>();

const inj = inject(AssetInspectorGeneralInjectKey);

const files = ref<string[]>(props.asset.def[props.field] ?? []);
watch(
    () => props.asset.def[props.field],
    (f) => {
        files.value = f ?? [];
    },
);

const reachedMax = computed(() => {
    if (props.maxItems === undefined) return false;
    return files.value.length >= props.maxItems;
});

function handleAdd(): void {
    files.value = [...files.value, ""];

    // Don't save after adding an empty element
}

function handleRemove(idx: number): void {
    const filesCopy = [...files.value];
    filesCopy.splice(idx, 1);
    files.value = filesCopy;

    save();
}

function handleChanged(idx: number, newText: string): void {
    if (files.value[idx] === newText) return;

    const filesCopy = [...files.value];
    filesCopy[idx] = newText;
    files.value = filesCopy;

    save();
}

function save(): void {
    if (files.value.length === 0) {
        inj?.updateAsset({ [props.field]: undefined });
        return;
    }

    const filteredFiles = files.value.filter((f) => f.length > 0);
    inj?.updateAsset({ [props.field]: filteredFiles });
}

const dropZoneRef = ref<HTMLDivElement>();
async function onDrop(fileList: File[] | null, event: DragEvent) {
    const entriesToAdd: string[] = [];

    if (fileList !== null) {
        for (const file of fileList) {
            const fullPath = window.electronAPI.webUtils.getPathForFile(file);
            const correctPath = await window.electronAPI.project.correctPath(fullPath);
            if (correctPath) {
                entriesToAdd.push(correctPath);
            }
        }
        return;
    }

    const plaintext = event.dataTransfer?.getData("text/plain");
    if (plaintext) {
        const lines = plaintext.split("\n");
        for (const line of lines) {
            const relativeLine = getGameOrContentRelativePath(line);
            entriesToAdd.push(relativeLine);
        }
    }

    const combined = new Set([...files.value, ...entriesToAdd]);

    files.value = Array.from(combined);

    save();
}
const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    preventDefaultForUnhandled: false,
});
</script>

<style scoped></style>
