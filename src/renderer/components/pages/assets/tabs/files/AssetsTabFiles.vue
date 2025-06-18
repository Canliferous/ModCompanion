<script setup lang="ts">
import { getAppConfig } from "~/renderer-config.js";
import AssetsTabFilesList from "~/components/pages/assets/tabs/files/AssetsTabFilesList.vue";
import { SharedAsset } from "Shared/SharedAsset.js";

defineProps<{ asset: SharedAsset }>();
</script>

<template>
    <AssetsTabFilesList
        color="amber"
        :files="asset.contentFiles"
        header="Content Files"
        :files-root="getAppConfig().contentPath"
    />
    <AssetsTabFilesList
        color="lime"
        :files="asset.gameFiles"
        header="Game Files"
        :files-root="getAppConfig().gamePath"
    />
</template>

<style scoped></style>
