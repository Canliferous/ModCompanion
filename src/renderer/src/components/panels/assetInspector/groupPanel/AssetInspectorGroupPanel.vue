<template>
    <AssetInspectorGroupRoot :group="group" />
</template>

<script setup lang="ts">
import AssetInspectorGroupRoot from "~/components/panels/assetInspector/groupPanel/AssetInspectorGroupRoot.vue";
import * as Shared from "mod_companion_shared";

defineProps<{
    group: Shared.AssetGroup.SharedAssetGroup;
}>();
</script>

<style scoped></style>
