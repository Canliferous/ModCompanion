<template>
    <slot :visible="visible" v-bind="attrs" />
</template>

<script setup lang="ts">
import { AssetInspectorPanelsInjectKey } from "~/components/panels/assetInspector/AssetInspector.model.js";
import { PanelComponentId } from "~/helper/PanelComponents.js";

const inj = inject(AssetInspectorPanelsInjectKey);
const props = defineProps<{ panelId: PanelComponentId }>();

const attrs = useAttrs();

const visible = computed(() => (inj !== undefined ? (inj.visiblePanels.get(props.panelId) ?? false) : false));

defineSlots<{
    default(props: { visible: boolean }): any;
}>();
</script>

<style scoped></style>
