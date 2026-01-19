<template>
    <UFormField ref="dropZoneRef" :label="heading" class="col-span-2">
        <template #hint />
        <div class="grid gap-1">
            <template v-for="(file, i) in files">
                <EditControlAssetFileListEntry
                    :entry="file"
                    :dir
                    @remove="() => handleRemove(i)"
                    @changed="(newText) => handleChanged(i, newText)"
                />
            </template>

            <div v-if="files.length < (maxItems ?? Number.MAX_VALUE)" class="grid grid-cols-[1fr_auto] gap-1">
                <MDropArea @change="handleDrop"> Drop files to add </MDropArea>
                <UButton :icon="AppDesign.Icons.ActionAdd" class="justify-self-end" @click="handleAdd" />
            </div>
        </div>
    </UFormField>
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetDefinitionFileArrays } from "Shared/SharedAssetDefinition.js";
import EditControlAssetFileListEntry from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetFileListEntry.vue";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";
import { getGameOrContentRelativePath, isGameOrContentRelativePath } from "~/helper/SourceFs.js";
import MDropArea from "~/components/common/MDropArea.vue";
import { AppDesign } from "~/design/AppDesign.js";

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

function handleDrop(plaintext: string) {
    const entriesToAdd: string[] = [];
    let changed = false;
    if (plaintext) {
        const lines = plaintext.split("\n");
        for (const line of lines) {
            if (isGameOrContentRelativePath(line)) {
                changed = true;
                entriesToAdd.push(getGameOrContentRelativePath(line));
            }
        }
    }

    if (changed) {
        const combined = new Set([...files.value, ...entriesToAdd]);
        files.value = Array.from(combined);
        save();
    }
}
</script>

<style scoped></style>
