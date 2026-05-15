<template>
    <div class="flex items-center h-full w-full gap-1" @mousedown.middle="handleClose" @dblclick="handleDoubleClick">
        <UIcon :name="behavior.getIcon(model)" />
        <span :class="{ italic: p.props.params.temporary }">{{ behavior.getTitle(model) }}</span>
        <UButton
            v-if="!p.props.params.noClose"
            :icon="AppDesign.Icons.Close"
            variant="link"
            size="xs"
            class="p-0"
            @click="handleClose"
        />
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";

import { IDockviewPanelHeaderProps } from "dockview-vue";
import { PanelModel, PanelParams, PanelsBehaviors } from "~/helper/GlobalComponents.js";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { FileInspectorModel } from "~/components/panels/fileInspector/FileInspector.model.js";

const p = defineProps<{ props: IDockviewPanelHeaderProps<PanelParams> }>();
const behavior = computed(() => PanelsBehaviors[p.props.params.panelName]);
const model = computed(() => usePanelsStore().getModel<PanelModel>(p.props.params.panelId));

function handleClose() {
    if (!p.props.params.noClose) {
        p.props.api.close();
    }
}

function handleDoubleClick() {
    usePanelsStore().makeNonTemporary(p.props.params.panelId);
}
</script>

<style scoped></style>
