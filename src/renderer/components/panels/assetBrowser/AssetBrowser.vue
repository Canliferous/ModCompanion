<template>
    <div class="grid grid-cols-[minmax(0,_1fr)] grid-rows-[auto_minmax(0,_1fr)] gap-1 h-full p-1">
        <div class="flex gap-1">
            <AssetBrowserSearchInput />
            <AssetBrowserRefreshButton />
        </div>
        <div class="overflow-auto">
            <AssetBrowserTable />
        </div>
    </div>
</template>

<script setup lang="ts">
import AssetBrowserTable from "~/components/panels/assetBrowser/AssetBrowserTable.vue";
import AssetBrowserRefreshButton from "~/components/panels/assetBrowser/AssetBrowserRefreshButton.vue";
import AssetBrowserSearchInput from "~/components/panels/assetBrowser/AssetBrowserSearchInput.vue";
</script>

<style scoped></style>
