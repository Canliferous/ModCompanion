<template>
    <TooltipProvider>
        <template v-if="model">
            <FileBrowserRoot v-model:dir="model.currentDir" v-model:search="model.searchTerm" />
        </template>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { TooltipProvider } from "reka-ui";
import { IDockviewPanelProps } from "dockview-vue";
import { PanelParams } from "~/helper/GlobalComponents.js";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { FileBrowserModel } from "~/components/panels/fileBrowser/FileBrowser.model.js";

const props = defineProps<{ params: IDockviewPanelProps<PanelParams<FileBrowserModel>> }>();
const model = usePanelsStore().getModel<FileBrowserModel>(props.params.params.panelId);
</script>

<style scoped></style>
