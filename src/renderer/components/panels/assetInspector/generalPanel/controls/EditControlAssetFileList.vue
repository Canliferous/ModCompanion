<template>
    <div class="border border-accented bg-neutral-900">
        <div v-for="(file, i) in files" class="border-b border-accented">
            <EditControlAssetFileListEntry
                :entry="file"
                @remove="() => handleRemove(i)"
                @changed="(newText) => handleChanged(i, newText)"
            />
        </div>

        <UButton block icon="tdesign:plus" label="Add" color="success" variant="ghost" @click="handleAdd" />
    </div>
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetDefinitionFileArrays } from "Shared/SharedAssetDefinition.js";
import EditControlAssetFileListEntry from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetFileListEntry.vue";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";

const props = defineProps<{ asset: SharedAsset; field: keyof SharedAssetDefinitionFileArrays }>();

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
</script>

<style scoped></style>
