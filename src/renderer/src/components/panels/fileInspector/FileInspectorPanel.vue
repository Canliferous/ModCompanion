<template>
    <template v-if="model">
        <FileInspectorRoot :file="model.file" />
    </template>
</template>

<script setup lang="ts">
import FileInspectorRoot from "~/components/panels/fileInspector/FileInspectorRoot.vue";
import { IDockviewPanelProps } from "dockview-vue";
import { PanelParams } from "~/helper/GlobalComponents.js";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { FileInspectorModel } from "~/components/panels/fileInspector/FileInspector.model.js";

const props = defineProps<{ params: IDockviewPanelProps<PanelParams> }>();
const model = computed(() => usePanelsStore().getModel<FileInspectorModel>(props.params.params.panelId));
</script>

<style scoped></style>
