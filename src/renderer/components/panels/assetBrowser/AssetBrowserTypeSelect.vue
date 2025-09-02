<template>
    <USelect
        :items="items"
        v-model="selected"
        value-key="id"
        multiple
        class="min-w-32"
        size="sm"
        placeholder="No Filter"
        icon="tdesign:filter"
    />
</template>

<script setup lang="ts">
import { getAssetTypeName, SharedAssetTypesValid } from "Shared/SharedAssetDefinition.js";
import { getAssetTypeIcon } from "~/design/AppDesign.js";
import { useAssetListStore } from "~/store/AssetListStore.js";

const listStore = useAssetListStore();

const items = SharedAssetTypesValid.map((k) => ({ id: k, label: getAssetTypeName(k), icon: getAssetTypeIcon(k) }));
const selected = ref<string[]>(listStore.typeFilter);
watch(selected, (value) => {
    listStore.typeFilter = value;
});
</script>

<style scoped></style>
