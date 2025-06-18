<template>
    <div>
        <div v-if="listStore.selectedAsset" class="grid gap-1">
            <div class="bg-accented p-1 flex gap-1 items-center">
                <AssetTypeIcon :type="listStore.selectedAsset.type" />
                <span class="text-sm font-mono">{{ listStore.selectedAsset.displayName }}</span>
                <span class="text-sm font-mono ml-auto">{{ listStore.selectedAsset.hash.substring(0, 5) }}</span>
            </div>
            <UTabs :items="tabs" variant="link" size="xs" color="neutral">
                <template #files>
                    <AssetsTabFiles :asset="listStore.selectedAsset" />
                </template>
                <template #texture><AssetsTabTexture /></template>
            </UTabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAssetListStore } from "~/store/AssetListStore.js";
import AssetTypeIcon from "~/components/common/AssetTypeIcon.vue";
import AssetsTabFiles from "~/components/pages/assets/tabs/files/AssetsTabFiles.vue";
import { SharedAssetType } from "Shared/SharedAsset.js";
import { TabsItem } from "@nuxt/ui/components/Tabs.vue.js";
import AssetsTabTexture from "~/components/pages/assets/tabs/texture/AssetsTabTexture.vue";

const listStore = useAssetListStore();

const asset = listStore.selectedAsset;

const filesTab: TabsItem = {
    label: "Files",
    slot: "files",
};
const tabs = computed(() => {
    switch (asset?.type) {
        case SharedAssetType.Texture: {
            return [
                filesTab,
                {
                    label: "Texture",
                    slot: "texture",
                },
            ];
        }

        case SharedAssetType.Unknown:
        default: {
            return [filesTab];
        }
    }
});
</script>

<style scoped></style>
