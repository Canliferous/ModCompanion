<template>
    <slot :visible="visible" v-bind="attrs" />
</template>

<script setup lang="ts">
import { AssetInspectorBehavior } from "~/components/panels/assetInspector/AssetInspector.model.js";
import { GlobalComponentName } from "~/helper/GlobalComponents.js";

const inj = inject(AssetInspectorBehavior.PanelsInjectKey);
const props = defineProps<{ panelId: GlobalComponentName }>();

const attrs = useAttrs();

const visible = computed(() => (inj !== undefined ? (inj.visiblePanels.get(props.panelId) ?? false) : false));

defineSlots<{
    default(props: { visible: boolean }): any;
}>();
</script>

<style scoped></style>
