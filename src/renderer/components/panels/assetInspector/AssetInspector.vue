<template>
    <div class="grid grid-cols-[minmax(0,_1fr)] h-full">
        <DockviewVue @ready="handleReady" :theme="themeDark" />
    </div>
</template>

<script setup lang="ts">
import { SharedAsset, SharedAssetType } from "Shared/SharedAssetDefinition.js";
import { DockviewApi, DockviewReadyEvent, DockviewVue, themeDark } from "dockview-vue";
import { getAdditionalPanels, Panel } from "~/store/PanelsStore.js";

const props = defineProps<{ asset: SharedAsset }>();

const api = ref<DockviewApi>();
const lastType = ref<SharedAssetType>(SharedAssetType.Unknown);

function handleReady(e: DockviewReadyEvent): void {
    api.value = e.api;
    updateTabs(props.asset.def.type, e.api);
}

watch(props.asset, (a) => {
    if (a.def.type === lastType.value) return;

    const api2 = api.value;
    if (api2 !== undefined) {
        updateTabs(a.def.type, api2);
    }

    lastType.value = a.def.type;
});

function updateTabs(type: SharedAssetType, api: DockviewApi): void {
    const additionalPanels = getAdditionalPanels();

    const whichPanelsShouldExist: Panel[] = [];

    switch (type) {
        case SharedAssetType.Texture: {
            whichPanelsShouldExist.push(additionalPanels.assetInspectorTexture);
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
