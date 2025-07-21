<template>
    <div class="flex gap-1 flex-wrap">
        <UButton
            size="sm"
            color="neutral"
            variant="subtle"
            @click="convert()"
            icon="tdesign:forward-filled"
            label="Convert"
        />
        <UTooltip :text="asset.defFilePath" v-if="asset.defFilePath">
            <UButton label="Open .mca" size="sm" variant="subtle" color="neutral" @click="openMca(asset)" />
        </UTooltip>
        <UTooltip :text="asset.defFilePath" v-if="asset.defFilePath">
            <UButton label="Browse to .mca" size="sm" variant="subtle" color="neutral" @click="browseToMca(asset)" />
        </UTooltip>
        <AssetsAssociatedFilesActions v-if="asset.def.associatedFiles" :files="asset.def.associatedFiles" />
    </div>
</template>

<script setup lang="ts">
import { browseToMca, openMca } from "~/helper/AssetHelper.js";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";

const props = defineProps<{ asset: SharedAsset }>();

const conversionStore = useAssetConversionStore();
function convert(): void {
    conversionStore.enqueue(props.asset.def.id);
}
</script>

<style scoped></style>
