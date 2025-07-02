<script setup lang="ts">
import { getAppConfig } from "~/renderer-config.js";
import AssetsTabFilesList from "~/components/pages/assets/tabs/files/AssetsTabFilesList.vue";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";

defineProps<{ asset: SharedAsset }>();
</script>

<template>
    <AssetsTabFilesList
        v-if="asset.def.contentFiles !== undefined"
        color="amber"
        :files="asset.def.contentFiles"
        header="Content Files"
        :files-root="getAppConfig().contentPath"
    />
    <AssetsTabFilesList
        v-if="asset.def.gameFiles !== undefined"
        color="lime"
        :files="asset.def.gameFiles"
        header="Game Files"
        :files-root="getAppConfig().gamePath"
    />
</template>

<style scoped></style>
