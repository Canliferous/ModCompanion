<template>
    <USelect
        v-model="selected"
        :items="items"
        value-key="id"
        multiple
        class="min-w-32"
        placeholder="No Filter"
        :icon="AppDesign.Icons.Filter"
    />
</template>

<script setup lang="ts">
import { getAssetTypeName, SharedAssetType, SharedAssetTypesValid } from "Shared/SharedAssetDefinition.js";
import { AppDesign, getAssetTypeIcon } from "~/design/AppDesign.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const listStore = useAssetListStore();

const items = SharedAssetTypesValid.map((k) => ({ id: k, label: getAssetTypeName(k), icon: getAssetTypeIcon(k) }));
const selected = ref<SharedAssetType[]>(listStore.typeFilter);
watch(selected, (value) => {
    listStore.typeFilter = value;
});
</script>

<style scoped></style>
