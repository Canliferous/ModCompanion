<template>
    <MPanelRoot>
        <AssetInspectorGroupRoot :group="group" />
    </MPanelRoot>
</template>

<script setup lang="ts">
import { SharedAssetGroup } from "Shared/SharedAssetGroup.js";
import AssetInspectorGroupRoot from "~/components/panels/assetInspector/groupPanel/AssetInspectorGroupRoot.vue";

const props = defineProps<{
    group: SharedAssetGroup;
}>();
</script>

<style scoped></style>
