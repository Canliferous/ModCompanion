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
import { AppDesign, getAssetTypeIcon } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";

const items = Shared.Asset.ValidTypes.map((k) => ({
    id: k,
    label: Shared.Asset.getAssetTypeName(k),
    icon: getAssetTypeIcon(k),
}));
const selected = ref([]);
// todo: reimplement type filter
// const selected = ref<Shared.Asset.Type[]>(listStore.typeFilter);
// watch(selected, (value) => {
//     listStore.typeFilter = value;
// });
</script>

<style scoped></style>
