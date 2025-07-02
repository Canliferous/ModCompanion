<script setup lang="ts">
import { getAppConfig } from "~/renderer-config.js";
import AssetsTabFilesList from "~/components/pages/assets/tabs/files/AssetsTabFilesList.vue";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";

defineProps<{ asset: SharedAsset }>();
</script>

<template>
    <AssetsTabFilesList
        v-if="asset.def.associatedFiles !== undefined"
        :files="asset.def.associatedFiles"
        header="Associated Files"
        :files-root="getAppConfig().rootPath"
        header-class="bg-pink-500 text-pink-950"
    />
    <AssetsTabFilesList
        v-if="asset.def.contentFiles !== undefined"
        :files="asset.def.contentFiles"
        header="Content Files"
        :files-root="getAppConfig().contentPath"
        header-class="bg-amber-500 text-amber-950"
    />
    <AssetsTabFilesList
        v-if="asset.def.gameFiles !== undefined"
        :files="asset.def.gameFiles"
        header="Game Files"
        :files-root="getAppConfig().gamePath"
        header-class="bg-lime-500 text-lime-950"
    />
</template>

<style scoped></style>
