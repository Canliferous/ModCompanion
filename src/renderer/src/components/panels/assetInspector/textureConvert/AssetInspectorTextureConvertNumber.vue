<template>
    <UInputNumber v-model="val" class="w-full" :min="min" :max="max" :step="step" @change="handleChange" />
</template>

<script setup lang="ts">
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";

import * as Shared from "mod_companion_shared";

const props = defineProps<{
    options: Shared.Vtf.SharedVtfCreateOptions;
    field: Shared.Vtf.SharedVtfCreateNumberOptions;
    default?: number;
    min?: number;
    max?: number;
    step?: number;
}>();
const val = ref(props.options[props.field] ?? props.default);
watch(
    () => props.options[props.field],
    (value) => {
        val.value = value ?? props.default;
    },
);

const inj = inject(AssetInspectorTextureConvertInjectKey);

function handleChange(): void {
    inj?.updateOptions({ [props.field]: toRaw(val.value) });
}
</script>

<style scoped></style>
