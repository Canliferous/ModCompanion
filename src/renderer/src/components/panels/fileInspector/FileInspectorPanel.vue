<template>
    <TooltipProvider>
        <template v-if="model">
            <FileInspectorRoot :file="model.file" />
        </template>
    </TooltipProvider>
</template>

<script setup lang="ts">
import FileInspectorRoot from "~/components/panels/fileInspector/FileInspectorRoot.vue";
import { IDockviewPanelProps } from "dockview-vue";
import { PanelParams } from "~/helper/GlobalComponents.js";
import { usePanelsStore } from "~/store/PanelsStore.js";
import {
    FileInspectorBehavior,
    FileInspectorModel,
    FileInspectorShortcuts,
} from "~/components/panels/fileInspector/FileInspector.model.js";

import { TooltipProvider } from "reka-ui";
import { useEvent } from "~/composables/useEvent.js";
import { FileBrowserBehavior } from "~/components/panels/fileBrowser/FileBrowser.model.js";

const props = defineProps<{ params: IDockviewPanelProps<PanelParams> }>();
const model = usePanelsStore().getModel<FileInspectorModel>(props.params.params.panelId);

const shortcuts: FileInspectorShortcuts = {
    onSave: useEvent(),
};

provide(FileInspectorBehavior.ShortcutsInjectKey, shortcuts);

if (model) {
    if (model._onKeyInput === undefined || Object.entries(model._onKeyInput).length === 0)
        model._onKeyInput = useEvent();

    model._onKeyInput.on((event) => {
        if (event.ctrlKey && event.key == "s") {
            shortcuts.onSave.call();
        }
    });
}
</script>

<style scoped></style>
