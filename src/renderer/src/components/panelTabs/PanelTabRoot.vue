<template>
    <div class="flex items-center h-full gap-1" @mousedown.middle="handleClose">
        <UIcon :name="behavior.getIcon(p.props.params.model)" />
        <span>{{ behavior.getTitle(p.props.params.model) }}</span>
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
import { PanelParams, PanelsBehaviors } from "~/helper/GlobalComponents.js";

const p = defineProps<{ props: IDockviewPanelHeaderProps<PanelParams<any>> }>();
const behavior = computed(() => PanelsBehaviors[p.props.params.panelName]);

function handleClose() {
    if (!p.props.params.noClose) {
        p.props.api.close();
    }
}
</script>

<style scoped></style>
