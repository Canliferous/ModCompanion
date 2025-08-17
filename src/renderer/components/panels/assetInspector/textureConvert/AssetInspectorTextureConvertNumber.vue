<template>
    <UInputNumber class="w-full" v-model="val" :min="min" :max="max" @change="handleChange" />
</template>

<script setup lang="ts">
import { SharedVtfCreateNumberOptions, SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";

const props = defineProps<{
    options: SharedVtfCreateOptions;
    field: SharedVtfCreateNumberOptions;
    default?: number;
    min?: number;
    max?: number;
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
