<template>
    <TooltipProvider>
        <AssetBrowserRoot v-if="model !== undefined" v-model="model" />
    </TooltipProvider>
</template>

<script setup lang="ts">
import { TooltipProvider } from "reka-ui";
import { IDockviewPanelProps } from "dockview-vue";
import { AssetBrowserModel } from "~/components/panels/assetBrowser/AssetBrowser.model.js";
import { PanelParams } from "~/helper/GlobalComponents.js";
import { usePanelsStore } from "~/store/PanelsStore.js";

const props = defineProps<{ params: IDockviewPanelProps<PanelParams> }>();
const model = usePanelsStore().getModel<AssetBrowserModel>(props.params.params.panelId);
</script>

<style scoped></style>
