<template>
    <TooltipProvider>
        <template v-if="model">
            <FileInspectorRoot :file="model.file" :panel-id="params.params.panelId" />
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
import { FileBrowserBehavior, FileBrowserShortcuts } from "~/components/panels/fileBrowser/FileBrowser.model.js";
import { usePanelShortcuts } from "~/composables/usePanelShortcuts.js";

const props = defineProps<{ params: IDockviewPanelProps<PanelParams> }>();
const model = computed(() => usePanelsStore().getModel<FileInspectorModel>(props.params.params.panelId));

const shortcuts = computed(() =>
    usePanelShortcuts<FileInspectorShortcuts>(model.value, {
        onSave: "ctrl_s",
    }),
);
provide(FileInspectorBehavior.ShortcutsInjectKey, shortcuts);
</script>

<style scoped></style>
