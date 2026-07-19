<template>
    <div class="grid grid-cols-2 gap-2">
        <template v-for="panel in SpawnablePanelComponentNames" :key="panel">
            <UButton
                :label="PanelsBehaviors[panel].getTitle(undefined)"
                :icon="PanelsBehaviors[panel].getIcon(undefined)"
                :size="buttonSize"
                @click="handleClick(panel)"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { AddPanelOptions } from "dockview-core/dist/cjs/dockview/options.js";
import { PanelComponentName, PanelsBehaviors, SpawnablePanelComponentNames } from "~/helper/GlobalComponents.js";
import { usePanelsStore } from "~/store/PanelsStore.js";

const panelsStore = usePanelsStore();

const props = defineProps<{ buttonSize?: string; spawnOptions?: Partial<AddPanelOptions> }>();
const emit = defineEmits<{ buttonClicked: [void] }>();

function handleClick(panel: PanelComponentName) {
    panelsStore.spawnPanel(panel, {}, props.spawnOptions);
    emit("buttonClicked");
}
</script>

<style scoped></style>
