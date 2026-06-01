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
import {
    FileBrowserBehavior,
    FileBrowserModel,
    FileBrowserShortcuts,
} from "~/components/panels/fileBrowser/FileBrowser.model.js";
import { usePanelShortcuts } from "~/composables/usePanelShortcuts.js";

const props = defineProps<{ params: IDockviewPanelProps<PanelParams> }>();
const model = usePanelsStore().getModel<FileBrowserModel>(props.params.params.panelId);

const shortcuts = usePanelShortcuts<FileBrowserShortcuts>(model, {
    onFocusSearch: "ctrl_k",
    onDelete: "Delete",
    onRefresh: "F5",
    onBack: "mouse3",
    onForward: "mouse4",
});
provide(FileBrowserBehavior.ShortcutsInjectKey, shortcuts);
</script>

<style scoped></style>
