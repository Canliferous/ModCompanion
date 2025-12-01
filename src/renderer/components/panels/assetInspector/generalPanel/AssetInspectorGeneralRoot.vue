<template>
    <MPanelRoot>
        <div class="grid grid-cols-2 gap-2 content-start">
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

            <EditControlAssetFileList
                heading="Content Files"
                :asset="asset"
                field="contentFiles"
                dir="content"
                :max-items="maxContentFiles"
            />
            <EditControlAssetFileList
                heading="Game Files"
                :asset="asset"
                field="gameFiles"
                dir="game"
                :max-items="maxGameFiles"
            />

            <UFormField label="Associated Files" class="col-span-2">
                <EditControlAssetAssociated :asset="asset" />
            </UFormField>

            <UFormField label="Credits" class="col-span-2">
                <EditControlAssetCredits :asset="asset" />
            </UFormField>
        </div>
    </MPanelRoot>
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetDefinition, SharedAssetTypes } from "Shared/SharedAssetDefinition.js";
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
        const newAsset: SharedAsset = { ...rawAsset, def: assetDef };
        const _ = assetStore.writeAssets([newAsset]);

        // Toast on failure?
    } finally {
        waiting.value = false;
    }
}

const maxContentFiles = computed(() => {
    if (props.asset.def.type === SharedAssetTypes.Texture) {
        return 1;
    } else return undefined;
});

const maxGameFiles = computed(() => {
    if (props.asset.def.type === SharedAssetTypes.Texture) {
        return 1;
    } else return undefined;
});
</script>

<style scoped></style>
