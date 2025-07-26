<template>
    <USelect :items="selectItems" v-model="assetType" value-key="id" :icon="icon" class="w-full" />
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetType } from "Shared/SharedAssetDefinition.js";
import { SelectItem } from "@nuxt/ui/components/Select.vue.js";
import { getAssetTypeIcon, getAssetTypeName } from "~/design/AppDesign.js";

const props = defineProps<{ asset: SharedAsset }>();

const assetType = ref<SharedAssetType>(props.asset.def.type);
watch(
    () => props.asset.def.type,
    (n) => {
        console.log(n);
        assetType.value = n;
    },
);

const selectItems = Object.values(SharedAssetType).map<SelectItem>((t) => ({
    id: t,
    label: getAssetTypeName(t),
    icon: getAssetTypeIcon(t),
}));
const icon = computed(() => selectItems.find((item) => item.value === assetType.value)?.icon);
</script>

<style scoped></style>
