<template>
    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-center">
        <template v-for="entry in SharedAssetDefinitionAssociatedFilesEntries">
            <EditControlAssetAssociatedEntry
                :file="associated[entry.field] ?? ''"
                :name="entry.name"
                @updated="(newText: string) => handleUpdated(newText, entry.field)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import {
    SharedAsset,
    SharedAssetDefinitionAssociatedFiles,
    SharedAssetDefinitionAssociatedFilesEntries,
} from "Shared/SharedAssetDefinition.js";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";
import EditControlAssetAssociatedEntry from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetAssociatedEntry.vue";

const props = defineProps<{ asset: SharedAsset }>();

const associated = ref(props.asset.def.associatedFiles ?? {});
watch(
    () => props.asset.def.associatedFiles,
    (f) => {
        associated.value = f ?? {};
    },
);

const inj = inject(AssetInspectorGeneralInjectKey);

function handleUpdated(newText: string, field: keyof SharedAssetDefinitionAssociatedFiles): void {
    associated.value[field] = newText;
    save();
}

function save() {
    const a = toRaw(associated.value);
    const hasSomeValue = Object.values(a).some((v) => v !== undefined && v !== "");
    if (!hasSomeValue) {
        inj?.updateAsset({ associatedFiles: undefined });
    } else {
        for (const v in a) {
            if (a[v as keyof typeof a] === "") {
                a[v as keyof typeof a] = undefined;
            }
        }
        inj?.updateAsset({ associatedFiles: a });
    }
}
</script>

<style scoped></style>
