<template>
    <MPanelRoot>
        <template #header>
            <div class="flex gap-1">
                <AssetBrowserSearchInput />
                <AssetBrowserTypeSelect />
                <UButtonGroup>
                    <AssetBrowserCollapseButtons />
                    <AssetBrowserRefreshButton />
                </UButtonGroup>
            </div>
        </template>
        <div>
            <AssetBrowserTable />
        </div>
    </MPanelRoot>
</template>

<script setup lang="ts">
import AssetBrowserTable from "~/components/panels/assetBrowser/AssetBrowserTable.vue";
import AssetBrowserRefreshButton from "~/components/panels/assetBrowser/AssetBrowserRefreshButton.vue";
import AssetBrowserSearchInput from "~/components/panels/assetBrowser/AssetBrowserSearchInput.vue";
</script>

<style scoped></style>
