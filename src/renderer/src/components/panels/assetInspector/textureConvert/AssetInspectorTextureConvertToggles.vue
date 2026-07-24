<template>
    <UCheckbox :id="useId()" v-model="noMips" label="No Mipmaps" @change="save" />
    <UCheckbox :id="useId()" v-model="noThumb" label="No Thumbnail" @change="save" />
</template>

<script setup lang="ts">
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";
import * as Shared from "mod_companion_shared";

const props = defineProps<{ options: Shared.Vtf.SharedVtfCreateOptions }>();
const noMips = ref<boolean>(props.options.noMips ?? false);
const noThumb = ref<boolean>(props.options.noThumbnail ?? false);
watch(
    () => props.options,
    (o) => {
        noMips.value = o.noMips ?? false;
        noThumb.value = o.noThumbnail ?? false;
    },
);

const inj = inject(AssetInspectorTextureConvertInjectKey);

function save(): void {
    inj?.updateOptions({
        noMips: toValue(noMips.value),
        noThumbnail: toValue(noThumb.value),
    });
}
</script>

<style scoped></style>
