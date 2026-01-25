<template>
    <UFormField label="MCA File" class="col-span-2">
        <UInput :model-value="asset.defFilePath" disabled class="w-full" size="xs" />
        <template #hint>
            <UButtonGroup>
                <UButton size="xs" label="Open" :icon="AppDesign.Icons.ActionOpenFileMca" @click="handleOpen" />
                <UButton size="xs" label="Browse to" :icon="AppDesign.Icons.ActionBrowseToMca" @click="handleBrowse" />
                <UButton
                    size="xs"
                    label="Explore to"
                    :icon="AppDesign.Icons.ActionExploreToMca"
                    @click="handleExplore"
                />
            </UButtonGroup>
        </template>
    </UFormField>
</template>

<script setup lang="ts">
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { browseToMca, exploreToMca, openMca } from "~/helper/AssetHelper.js";
import { AppDesign } from "~/design/AppDesign.js";

const props = defineProps<{ asset: SharedAsset }>();

function handleOpen() {
    openMca(props.asset);
}

function handleExplore() {
    exploreToMca(props.asset);
}

function handleBrowse() {
    browseToMca(props.asset);
}
</script>

<style scoped></style>
