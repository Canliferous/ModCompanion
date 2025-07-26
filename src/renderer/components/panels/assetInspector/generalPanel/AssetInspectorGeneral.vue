<template>
    <div class="p-2 grid grid-cols-2 gap-2">
        <UFormField label="Type">
            <EditControlAssetType :asset="asset" />
        </UFormField>
        <UFormField label="ID">
            <UInput disabled v-model="asset.def.id" class="w-full" />
        </UFormField>
        <UFormField label="Display Name" class="col-span-2">
            <EditControlAssetDisplayName :asset="asset" />
        </UFormField>
    </div>
</template>

<script setup lang="ts">
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";
import EditControlAssetDisplayName from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetDisplayName.vue";
import EditControlAssetType from "~/components/panels/assetInspector/generalPanel/controls/EditControlAssetType.vue";

const props = defineProps<{ asset: SharedAsset }>();
const waiting = ref(false);
provide(AssetInspectorGeneralInjectKey, { waiting });
</script>

<style scoped></style>
