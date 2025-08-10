<template>
    <div class="border border-accented bg-neutral-900">
        <div v-for="(file, i) in files" class="border-b border-accented">
            <EditControlAssetFileListEntry
                :entry="file"
                @remove="() => handleRemove(i)"
                @changed="(newText) => handleChanged(i, newText)"
                :dir
            />
        </div>

        <UButton
            block
            icon="tdesign:plus"
            label="Add"
            color="success"
            variant="ghost"
            @click="handleAdd"
            :disabled="reachedMax"
        />
    </div>
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetDefinitionFileArrays } from "Shared/SharedAssetDefinition.js";
import EditControlAssetFileListEntry from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetFileListEntry.vue";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";

const props = defineProps<{
    asset: SharedAsset;
    field: keyof SharedAssetDefinitionFileArrays;
    dir: string;
    maxItems?: number;
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
</script>

<style scoped></style>
