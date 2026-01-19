<template>
    <div class="grid grid-cols-[minmax(0,_1fr)] grid-rows-1 h-full">
        <DockviewVue
            :theme="themeModcomp"
            :default-tab-component="PanelComponents.tabComponents.panelTab.componentId"
            @ready="handleReady"
        />
    </div>
</template>

<script setup lang="ts">
import {
    isTextureAsset,
    SharedAsset,
    SharedAssetType,
    SharedAssetTypes,
    SharedTextureAsset,
} from "Shared/SharedAssetDefinition.js";
import { DockviewApi, DockviewReadyEvent, DockviewVue, SerializedDockview } from "dockview-vue";
import { AssetInspectorTextureInjectKey } from "~/components/panels/assetInspector/AssetInspector.model.js";
import { SharedImageMetaReport } from "Shared/SharedImageMetaReport.js";
import pathe from "pathe";
import { getAppConfig } from "~/renderer-config.js";
import { ComponentDesc, PanelComponents, PanelIcons, PanelTitles } from "~/helper/PanelComponents.js";
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";
import { fetchImageMeta } from "~/store/ImageCacheStore.js";
import { themeModcomp } from "~/design/ModcompDockviewTheme.js";

const props = defineProps<{ asset: SharedAsset }>();
const workspaceStore = useWorkspaceStore();

const api = ref<DockviewApi>();
const lastType = ref<SharedAssetType | undefined>();

const textureMeta = ref<SharedImageMetaReport | undefined>(undefined);

function handleReady(e: DockviewReadyEvent): void {
    api.value = e.api;
    updateTabs(props.asset.def.type, e.api);

    handleAssetUpdated(props.asset, api.value);

    e.api.onDidLayoutChange(() => serializeLayout(e.api));
}

watch(
    () => props.asset,
    (a) => {
        if (api.value !== undefined) {
            handleAssetUpdated(a, api.value);
        }
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
    fetchImageMeta(fullPath).then((meta) => {
        textureMeta.value = meta;
    });
}

function serializeLayout(a: DockviewApi) {
    const json = a.toJSON();
    const currentType = props.asset.def.type;
    const workspace = workspaceStore.activeWorkspace ?? "unknown";
    const key = `asset-inspector-layout-${workspace}-${currentType}`;

    localStorage.setItem(key, JSON.stringify(json));
}

function deserializeLayout(type: SharedAssetType): SerializedDockview | undefined {
    const workspace = workspaceStore.activeWorkspace ?? "unknown";
    const key = `asset-inspector-layout-${workspace}-${type}`;
    const itemRaw = localStorage.getItem(key);
    if (itemRaw === null) {
        return undefined;
    }

    const item = JSON.parse(itemRaw);
    return item;
}

function getPanelsByType(type: SharedAssetType) {
    const additionalPanels = PanelComponents.additional;

    const defaultPanels = [additionalPanels.assetInspectorGeneral];
    const whichPanelsShouldExist: ComponentDesc[] = defaultPanels;

    if (type === SharedAssetTypes.Texture) {
        whichPanelsShouldExist.push(additionalPanels.assetInspectorTexturePreview);
        whichPanelsShouldExist.push(additionalPanels.assetInspectorTextureChannels);
        whichPanelsShouldExist.push(additionalPanels.assetInspectorTextureMetadata);
        whichPanelsShouldExist.push(additionalPanels.assetInspectorTextureConvert);
        whichPanelsShouldExist.push(additionalPanels.assetInspectorTextureHotspotEditor);
    }

    return whichPanelsShouldExist;
}

function setupTabs(type: SharedAssetType, api: DockviewApi) {
    const whichPanelsShouldExist = getPanelsByType(type);

    const panels = api.panels;
    // Spawn missing panels
    for (const panel of whichPanelsShouldExist) {
        const alreadyExists = panels.some((p) => p.id === panel.componentId);
        if (!alreadyExists) {
            api.addPanel({
                title: PanelTitles[panel.componentId],
                id: panel.componentId,
                component: panel.componentId,
                tabComponent: PanelComponents.tabComponents.panelTab.componentId,
                params: { icon: PanelIcons[panel.componentId], noClose: true },
            });
        }
    }

    // Destroy unneeded panels
    for (const panel of panels) {
        const shouldExist = whichPanelsShouldExist.some((p) => panel.id === p.componentId);
        if (!shouldExist) {
            api.removePanel(panel);
        }
    }
}

function updateTabs(type: SharedAssetType, api: DockviewApi): void {
    if (type === lastType.value) return;
    lastType.value = type;

    const savedPanels = deserializeLayout(type);
    if (savedPanels) {
        try {
            api.fromJSON(savedPanels);
        } catch (e) {
            console.warn(e);
        }
    }

    setupTabs(type, api);
    serializeLayout(api);
}
</script>

<style scoped></style>
