<template>
    <div class="grid grid-cols-3 gap-2">
        <template v-for="panel in panels" :key="panel.componentId">
            <UButton
                :label="PanelTitles[panel.componentId]"
                :icon="PanelIcons[panel.componentId]"
                :size="buttonSize"
                @click="handleClick(panel)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { ComponentDesc, PanelComponents, PanelIcons, PanelTitles } from "~/helper/PanelComponents.js";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { AddPanelOptions } from "dockview-core/dist/cjs/dockview/options.js";

const panelsStore = usePanelsStore();
const panels = Object.values(PanelComponents.panels);

const props = defineProps<{ buttonSize?: string; spawnOptions?: Partial<AddPanelOptions> }>();
const emit = defineEmits<{ buttonClicked: [void] }>();

function handleClick(panel: ComponentDesc) {
    panelsStore.trySpawnPanel(panel, props.spawnOptions);
    emit("buttonClicked");
}
</script>

<style scoped></style>
