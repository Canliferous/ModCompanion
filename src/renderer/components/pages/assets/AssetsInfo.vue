<template>
    <div>
        <div v-if="listStore.selectedAsset" class="grid gap-1">
            <div class="bg-accented p-1 flex gap-1 items-center">
                <AssetName
                    :name="listStore.selectedAsset.def.displayName ?? '(Unknown)'"
                    :type="listStore.selectedAsset.def.type"
                />
                <div class="ml-auto">
                    <UButton size="sm" color="neutral" variant="subtle" @click="convert()">Convert</UButton>
                    <AssetHash :hash="listStore.selectedAssetHash" />
                </div>
            </div>
            <UTabs :items="tabs" variant="link" size="xs" color="neutral">
                <template #files>
                    <AssetsTabFiles :asset="listStore.selectedAsset" />
                </template>
                <template #texture>
                    <AssetsTabTexture :asset="listStore.selectedAsset as SharedTextureAsset" />
                </template>
            </UTabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAssetListStore } from "~/store/AssetListStore.js";
import { SharedAssetType, SharedTextureAsset } from "Shared/SharedAssetDefinition.js";
import { TabsItem } from "@nuxt/ui/components/Tabs.vue.js";

const listStore = useAssetListStore();

const filesTab: TabsItem = {
    label: "Files",
    slot: "files",
};
const tabs = computed(() => {
    switch (listStore.selectedAsset?.def.type) {
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

function convert() {
    if (listStore.selectedAssetHash) {
        window.electronAPI.conversion.enqueue(listStore.selectedAssetHash);
    }
}
</script>

<style scoped></style>
