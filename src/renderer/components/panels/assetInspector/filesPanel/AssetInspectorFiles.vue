<script setup lang="ts">
import { getAppConfig } from "~/renderer-config.js";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import AssetInspectorFilesList from "~/components/panels/assetInspector/filesPanel/AssetInspectorFilesList.vue";

defineProps<{ asset: SharedAsset }>();
</script>

<template>
    <!--    <AssetInspectorFilesList-->
    <!--        v-if="asset.def.associatedFiles !== undefined"-->
    <!--        :files="asset.def.associatedFiles"-->
    <!--        header="Associated Files"-->
    <!--        :files-root="getAppConfig().rootPath"-->
    <!--        header-class="bg-pink-500 text-pink-950"-->
    <!--    />-->
    <AssetInspectorFilesList
        v-if="asset.def.contentFiles !== undefined"
        :files="asset.def.contentFiles"
        header="Content Files"
        :files-root="getAppConfig().contentPath"
        header-class="bg-amber-500 text-amber-950"
    />
    <AssetInspectorFilesList
        v-if="asset.def.gameFiles !== undefined"
        :files="asset.def.gameFiles"
        header="Game Files"
        :files-root="getAppConfig().gamePath"
        header-class="bg-lime-500 text-lime-950"
    />
</template>

<style scoped></style>
