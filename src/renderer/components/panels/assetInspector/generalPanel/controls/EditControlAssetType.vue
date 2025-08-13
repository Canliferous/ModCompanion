<template>
    <USelect :items="selectItems" v-model="assetType" value-key="id" :icon="icon" class="w-full" @change="updateType" />
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetType, SharedAssetTypes } from "Shared/SharedAssetDefinition.js";
import { SelectItem } from "@nuxt/ui/components/Select.vue.js";
import { getAssetTypeIcon, getAssetTypeName } from "~/design/AppDesign.js";
import { AssetInspectorGeneralInjectKey } from "~/components/panels/assetInspector/generalPanel/AssetInspectorGeneral.model.js";

const props = defineProps<{ asset: SharedAsset }>();

const assetType = ref<SharedAssetType>(props.asset.def.type);
watch(
    () => props.asset.def.type,
    (n) => {
        assetType.value = n;
    },
);

const selectItems = Object.values(SharedAssetTypes).map<SelectItem>((t) => ({
    id: t,
    label: getAssetTypeName(t),
    icon: getAssetTypeIcon(t),
}));
const icon = computed(() => selectItems.find((item) => item.value === assetType.value)?.icon);

const inj = inject(AssetInspectorGeneralInjectKey);

async function updateType() {
    if (assetType.value === props.asset.def.type) return;

    inj?.updateAsset({ type: assetType.value });
}
</script>

<style scoped></style>
