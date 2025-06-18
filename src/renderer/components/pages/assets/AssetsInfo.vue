<template>
    <div>
        <div v-if="listStore.selectedAsset" class="grid gap-1">
            <UTabs :tabs="tabs" />
            <div class="bg-accented p-1">
                <span class="text-sm font-mono">{{ listStore.selectedAsset.displayName }}</span>
            </div>
            <AssetsInfoFiles
                color="amber"
                :files="listStore.selectedAsset.contentFiles"
                header="Content Files"
                :files-root="getAppConfig().contentPath"
            />
            <AssetsInfoFiles
                color="lime"
                :files="listStore.selectedAsset.gameFiles"
                header="Game Files"
                :files-root="getAppConfig().gamePath"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import type { TabsItem } from "@nuxt/ui";
import UTabs from "@nuxt/ui/components/Tabs.vue";
import { useAssetListStore } from "~/store/AssetListStore.js";
import AssetsInfoFiles from "~/components/pages/assets/AssetsInfoFiles.vue";
import { getAppConfig } from "~/renderer-config.js";

const listStore = useAssetListStore();

const tabs: Ref<TabsItem[]> = ref([
    {
        label: "Files",
    },
    {
        label: "More",
    },
]);
</script>

<style scoped></style>
