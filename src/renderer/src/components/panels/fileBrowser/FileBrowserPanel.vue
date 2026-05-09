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
import { useEvent } from "~/composables/useEvent.js";

const props = defineProps<{ params: IDockviewPanelProps<PanelParams> }>();
const model = usePanelsStore().getModel<FileBrowserModel>(props.params.params.panelId);

const shortcuts: FileBrowserShortcuts = {
    onFocusSearch: useEvent(),
};
provide(FileBrowserBehavior.ShortcutsInjectKey, shortcuts);

if (model) {
    model.onKeyInput = useEvent();
    model.onKeyInput.on((event) => {
        if (event.ctrlKey && event.key == "k") {
            shortcuts.onFocusSearch.call();
        }
    });
}
</script>

<style scoped></style>
