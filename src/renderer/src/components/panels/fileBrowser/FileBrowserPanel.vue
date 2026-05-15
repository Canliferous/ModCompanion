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
    onRefresh: useEvent(),
    onBack: useEvent(),
    onForward: useEvent(),
};
provide(FileBrowserBehavior.ShortcutsInjectKey, shortcuts);

if (model) {
    if (model.onKeyInput === undefined) model.onKeyInput = useEvent();
    model.onKeyInput.on((event) => {
        if (event.ctrlKey && event.key == "k") {
            shortcuts.onFocusSearch.call();
        }
        if (event.key == "F5") {
            shortcuts.onRefresh.call();
        }
    });

    if (model.onClickInput === undefined) model.onClickInput = useEvent();
    model.onClickInput.on((event) => {
        if (event.button === 3) {
            shortcuts.onBack.call();
        }
        if (event.button === 4) {
            shortcuts.onForward.call();
        }
    });
}
</script>

<style scoped></style>
