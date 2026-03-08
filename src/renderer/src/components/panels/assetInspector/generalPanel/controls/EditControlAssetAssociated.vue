<template>
    <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-center">
        <template v-for="entry in Shared.Asset.AssociatedFilesEntries" :key="entry.field">
            <EditControlAssetAssociatedEntry
                :file="associated[entry.field] ?? ''"
                :entry="entry"
                @updated="(newText: string) => handleUpdated(newText, entry.field)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";
import EditControlAssetAssociatedEntry from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetAssociatedEntry.vue";
import * as Shared from "mod_companion_shared";

const props = defineProps<{ asset: Shared.Asset.SharedAsset }>();

const associated = ref(props.asset.def.associatedFiles ?? {});
watch(
    () => props.asset.def.associatedFiles,
    (f) => {
        associated.value = f ?? {};
    },
);

const inj = inject(AssetInspectorGeneralInjectKey);

function handleUpdated(newText: string, field: keyof Shared.Asset.SharedAssetDefinitionAssociatedFiles): void {
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
