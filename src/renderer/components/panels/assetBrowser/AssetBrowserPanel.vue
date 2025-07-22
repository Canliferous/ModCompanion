<template>
    <div class="grid grid-cols-[minmax(0,_1fr)] grid-rows-[auto_minmax(0,_1fr)] gap-1 h-full">
        <div class="flex gap-1">
            <AssetBrowserSearchInput />
            <AssetBrowserRefreshButton />
        </div>
        <div class="overflow-auto">
            <AssetBrowser />
        </div>
    </div>
</template>

<script setup lang="ts">
import AssetBrowser from "~/components/panels/assetBrowser/AssetBrowser.vue";
import AssetBrowserSearchInput from "~/components/panels/assetBrowser/AssetBrowserSearchInput.vue";
import AssetBrowserRefreshButton from "~/components/panels/assetBrowser/AssetBrowserRefreshButton.vue";
</script>

<style scoped></style>
