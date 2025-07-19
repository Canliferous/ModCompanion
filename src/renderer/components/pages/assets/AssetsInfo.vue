<template>
    <div>
        <div v-if="listStore.activeAsset" class="grid gap-1">
            <div class="bg-accented p-1 flex gap-1 items-center">
                <AssetName
                    :name="listStore.activeAsset.def.displayName ?? '(Unknown)'"
                    :type="listStore.activeAsset.def.type"
                />
                <div class="ml-auto">
                    <UButton size="sm" color="neutral" variant="subtle" @click="convert()">Convert</UButton>
                    <AssetIdDisplay :id="listStore.activeAsset.def.id" />
                </div>
            </div>
            <div class="flex gap-1">
                <UTooltip :text="listStore.activeAsset.defFilePath" v-if="listStore.activeAsset.defFilePath">
                    <UButton
                        label="Open .mca"
                        size="sm"
                        variant="subtle"
                        color="neutral"
                        @click="openMca(listStore.activeAsset)"
                    />
                </UTooltip>
                <UTooltip :text="listStore.activeAsset.defFilePath" v-if="listStore.activeAsset.defFilePath">
                    <UButton
                        label="Browse to .mca"
                        size="sm"
                        variant="subtle"
                        color="neutral"
                        @click="browseToMca(listStore.activeAsset)"
                    />
                </UTooltip>
                <AssetsAssociatedFilesActions
                    v-if="listStore.activeAsset.def.associatedFiles"
                    :files="listStore.activeAsset.def.associatedFiles"
                />
            </div>
            <UTabs :items="tabs" variant="link" size="xs" color="neutral">
                <template #files>
                    <AssetsTabFiles :asset="listStore.activeAsset" />
                </template>
                <template #texture>
                    <AssetsTabTexture :asset="listStore.activeAsset as SharedTextureAsset" />
                </template>
            </UTabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { SharedAssetType, SharedTextureAsset } from "Shared/SharedAssetDefinition.js";
import { TabsItem } from "@nuxt/ui/components/Tabs.vue.js";
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { browseToMca, openMca } from "~/helper/AssetHelper.js";

const listStore = useAssetListStore();
const conversionStore = useAssetConversionStore();

const filesTab: TabsItem = {
    label: "Files",
    slot: "files",
};
const tabs = computed(() => {
    switch (listStore.activeAsset?.def.type) {
        case SharedAssetType.Texture: {
            return [
                {
                    label: "Texture",
                    slot: "texture",
                },
                filesTab,
            ];
        }

        case SharedAssetType.Unknown:
        default: {
            return [filesTab];
        }
    }
});

function convert(): void {
    if (listStore.activeAssetId) {
        conversionStore.enqueue(listStore.activeAssetId);
    }
}
</script>

<style scoped></style>
