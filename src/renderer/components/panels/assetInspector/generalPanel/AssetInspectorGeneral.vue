<template>
    <div class="p-2 grid grid-cols-2 gap-2">
        <EditControlAssetDef :asset="asset" />
        <UFormField label="Type">
            <EditControlAssetType :asset="asset" />
        </UFormField>
        <UFormField label="ID">
            <UInput disabled v-model="asset.def.id" class="w-full" />
        </UFormField>
        <UFormField label="Display Name" class="col-span-2">
            <EditControlAssetDisplayName :asset="asset" />
        </UFormField>
        <UFormField label="Content Files" class="col-span-2">
            <EditControlAssetFileList :asset="asset" field="contentFiles" dir="content" />
        </UFormField>
        <UFormField label="Game Files" class="col-span-2">
            <EditControlAssetFileList :asset="asset" field="gameFiles" dir="game" />
        </UFormField>

        <USeparator class="my-2" />

        <UFormField label="Associated Files" class="col-span-2">
            <EditControlAssetAssociated :asset="asset" />
        </UFormField>
    </div>
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetDefinition } from "Shared/SharedAssetDefinition.js";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";
import EditControlAssetDisplayName from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetDisplayName.vue";
import EditControlAssetType from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetType.vue";
import { useAssetListStore } from "~/store/AssetListStore.js";
import EditControlAssetDef from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetDef.vue";
import EditControlAssetAssociated from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetAssociated.vue";

const props = defineProps<{ asset: SharedAsset }>();
const waiting = ref(false);
provide(AssetInspectorGeneralInjectKey, { waiting, updateAsset });

const assetStore = useAssetListStore();

async function updateAsset(def: Partial<SharedAssetDefinition>) {
    waiting.value = true;

    try {
        const rawAsset = toRaw(props.asset);
        const assetDef: SharedAssetDefinition = { ...rawAsset.def, ...def };
        const result = await window.electronAPI.asset.update(rawAsset.def.id, assetDef);
        if (result) {
            assetStore.updateAssets([result]);
        }
        // Toast on failure?
    } finally {
        waiting.value = false;
    }
}
</script>

<style scoped></style>
