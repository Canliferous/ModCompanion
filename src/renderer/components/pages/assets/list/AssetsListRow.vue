<template>
    <UContextMenu :items="items">
        <button
            class="grid col-span-full grid-cols-subgrid p-1 items-center justify-center border-b-1 border-accented hover:bg-accented cursor-pointer text-left text-neutral-300 focus-visible:outline-none"
            :class="{ 'bg-primary/10 text-primary hover:bg-primary/30': isSelected }"
            @click="listStore.selectAsset(asset.def.id)"
            @keydown.down="navigateDown()"
            @keydown.up="navigateUp()"
            ref="btn"
        >
            <div class="grid col-span-full grid-cols-subgrid gap-y-1">
                <div class="flex items-center"><AssetTypeIcon :type="asset.def.type" /></div>
                <div class="text-sm font-mono">
                    {{ asset.def.displayName }}
                </div>
                <AssetsListRowConverted :state="conversionStore.getState(asset.def.id)" />
                <AssetsListRowFiles v-if="isSelected" :asset="asset" />
            </div>
        </button>
    </UContextMenu>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from "vue";
import { SharedAsset } from "Shared/SharedAssetDefinition.js";
import { useAssetListStore } from "~/store/AssetListStore.js";
import AssetTypeIcon from "~/components/common/AssetTypeIcon.vue";
import AssetsListRowFiles from "~/components/pages/assets/list/AssetsListRowFiles.vue";
import AssetsListRowConverted from "~/components/pages/assets/list/AssetsListRowConverted.vue";
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { ContextMenuItem } from "@nuxt/ui/components/ContextMenu.vue.js";
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";

const conversionStore = useAssetConversionStore();
const listStore = useAssetListStore();

const props = defineProps<{ asset: SharedAsset }>();
const isSelected = computed(() => listStore.selectedAssetHash === props.asset.def.id);

const btn = useTemplateRef("btn");

watch(isSelected, (selected) => {
    if (selected) {
        btn.value?.focus();
    }
});

function navigateDown() {
    const hash = listStore.selectedAssetHash;
    if (!hash) {
        return;
    }

    const index = listStore.filteredAssets.findIndex((a) => a.def.id === hash);
    const nextIndex = index + 1;
    if (nextIndex > listStore.filteredAssets.length - 1) {
        return;
    }
    const nextHash = listStore.filteredAssets[nextIndex].def.id;
    listStore.selectAsset(nextHash);
}
function navigateUp() {
    const hash = listStore.selectedAssetHash;
    if (!hash) {
        return;
    }

    const index = listStore.filteredAssets.findIndex((a) => a.def.id === hash);
    const nextIndex = index - 1;
    if (nextIndex < 0) {
        return;
    }

    const nextHash = listStore.filteredAssets[nextIndex].def.id;
    listStore.selectAsset(nextHash);
}

const items: Ref<ContextMenuItem[]> = ref<ContextMenuItem[]>([
    {
        label: "Open MCA",
        onSelect(e: Event) {
            window.electronAPI.app.openFile(
                pathe.join(getAppConfig().contentPath, getAppConfig().gameName, props.asset.defFilePath ?? ""),
            );
        },
        disabled: props.asset.defFilePath === undefined,
    },
    {
        label: "Browse to MCA",
        onSelect(e) {
            window.electronAPI.app.browseToFile(
                pathe.join(getAppConfig().contentPath, getAppConfig().gameName, props.asset.defFilePath ?? ""),
            );
        },
        disabled: props.asset.defFilePath === undefined,
    },
] satisfies ContextMenuItem[]);
</script>

<style scoped></style>
