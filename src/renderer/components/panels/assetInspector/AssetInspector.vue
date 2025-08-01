<template>
    <div class="grid grid-cols-[minmax(0,_1fr)] h-full">
        <DockviewVue @ready="handleReady" :theme="themeDark" />
    </div>
</template>

<script setup lang="ts">
import { isTextureAsset, SharedAsset, SharedAssetType, SharedTextureAsset } from "Shared/SharedAssetDefinition.js";
import { DockviewApi, DockviewReadyEvent, DockviewVue, themeDark } from "dockview-vue";
import { getAdditionalPanels, Panel } from "~/store/PanelsStore.js";
import { AssetInspectorTextureInjectKey } from "~/components/panels/assetInspector/AssetInspector.model.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import { useImageCacheStore } from "~/store/ImageCacheStore.js";
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";

const props = defineProps<{ asset: SharedAsset }>();

const imageCacheStore = useImageCacheStore();

const api = ref<DockviewApi>();
const lastType = ref<SharedAssetType | undefined>();

const textureMeta = ref<SharedImageMetaReport | undefined>(undefined);

function handleReady(e: DockviewReadyEvent): void {
    api.value = e.api;
    updateTabs(props.asset.def.type, e.api);
}

watch(
    () => props.asset,
    (a) => {
        if (api.value !== undefined) {
            handleAssetUpdated(a, api.value);
        }

        lastType.value = a.def.type;
    },
);

provide(AssetInspectorTextureInjectKey, {
    meta: textureMeta,
});

function handleAssetUpdated(asset: SharedAsset, api: DockviewApi): void {
    if (isTextureAsset(asset)) {
        updateTextureMeta(asset);
    }

    updateTabs(asset.def.type, api);
}

function updateTextureMeta(asset: SharedTextureAsset) {
    const content = asset.def.contentFiles;
    if (content === undefined || content.length === 0) {
        // TODO: Clear
        return;
    }
    const sourceFile = content[0];

    const fullPath = pathe.join(getAppConfig().contentPath, sourceFile);
    imageCacheStore.getMeta(fullPath).then((meta) => {
        textureMeta.value = meta;
    });
}

function updateTabs(type: SharedAssetType, api: DockviewApi): void {
    if (type === lastType.value) return;
    const additionalPanels = getAdditionalPanels();

    const whichPanelsShouldExist: Panel[] = [];

    switch (type) {
        case SharedAssetType.Texture: {
            whichPanelsShouldExist.push(additionalPanels.assetInspectorTexturePreview);
            whichPanelsShouldExist.push(additionalPanels.assetInspectorTextureChannels);
            whichPanelsShouldExist.push(additionalPanels.assetInspectorTextureMetadata);
            whichPanelsShouldExist.push(additionalPanels.assetInspectorTextureConvert);
        }
    }

    // Add last
    whichPanelsShouldExist.push(additionalPanels.assetInspectorGeneral);

    const panels = api.panels;
    for (const panel of whichPanelsShouldExist) {
        if (panels.some((p) => p.id === panel.componentId)) continue;

        api.addPanel({
            title: panel.title,
            id: panel.componentId,
            component: panel.componentId,
        });
    }
}
</script>

<style scoped></style>
