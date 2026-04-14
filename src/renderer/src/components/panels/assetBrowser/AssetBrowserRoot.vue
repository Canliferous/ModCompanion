<template>
    <MPanelRoot noScroll>
        <template #header>
            <div class="flex gap-1">
                <UInput
                    v-model="model.searchTerm"
                    placeholder="Search"
                    :leading-icon="AppDesign.Icons.Search"
                    class="grow"
                    autofocus
                />
                <AssetBrowserTypeSelect />
                <UButtonGroup>
                    <AssetBrowserCollapseButtons />
                    <AssetBrowserRefreshButton />
                </UButtonGroup>
            </div>
        </template>
        <AssetBrowserTable v-model="model" />
    </MPanelRoot>
</template>

<script setup lang="ts">
import AssetBrowserTable from "~/components/panels/assetBrowser/AssetBrowserTable.vue";
import AssetBrowserRefreshButton from "~/components/panels/assetBrowser/AssetBrowserRefreshButton.vue";
import { AssetBrowserModel } from "~/components/panels/assetBrowser/AssetBrowser.model.js";
import { AppDesign } from "~/design/AppDesign.js";

const model = defineModel<AssetBrowserModel>({ required: true });
</script>

<style scoped></style>
