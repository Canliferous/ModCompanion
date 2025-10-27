<template>
    <UCheckbox label="No Mipmaps" v-model="noMips" @change="save" :id="useId()" />
    <UCheckbox label="No Animation" v-model="noAnim" @change="save" :id="useId()" />
    <UCheckbox label="No Thumbnail" v-model="noThumb" @change="save" :id="useId()" />
</template>

<script setup lang="ts">
import { SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";

const props = defineProps<{ options: SharedVtfCreateOptions }>();
const noMips = ref<boolean>(props.options.noMips ?? false);
const noAnim = ref<boolean>(props.options.noAnimation ?? false);
const noThumb = ref<boolean>(props.options.noThumbnail ?? false);
watch(
    () => props.options,
    (o) => {
        noMips.value = o.noMips ?? false;
        noAnim.value = o.noAnimation ?? false;
        noThumb.value = o.noThumbnail ?? false;
    },
);

const inj = inject(AssetInspectorTextureConvertInjectKey);

function save(): void {
    inj?.updateOptions({
        noMips: toValue(noMips.value),
        noAnimation: toValue(noAnim.value),
        noThumbnail: toValue(noThumb.value),
    });
}
</script>

<style scoped></style>
