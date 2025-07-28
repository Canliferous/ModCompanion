<template>
    <template v-for="group in SharedVtfFlagGroups">
        <AssetInspectorTextureConvertFlagsGroup
            :label="group.label"
            :flags="group.flags"
            :values="flagValues"
            @toggle="handleToggle"
        />
    </template>
    <template v-if="ungroupedFlags.length > 0">
        <AssetInspectorTextureConvertFlagsGroup
            label="Other Flags"
            :flags="ungroupedFlags"
            :values="flagValues"
            @toggle="handleToggle"
        />
    </template>
</template>

<script setup lang="ts">
import { SharedVtfCreateOptions } from "Shared/vtf/SharedVtf.js";
import { getVtfFlagsUngrouped, SharedVtfFlag, SharedVtfFlagGroups, SharedVtfFlags } from "Shared/vtf/SharedVtfFlag.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";

const props = defineProps<{ options: SharedVtfCreateOptions }>();
const flagValues = ref(props.options.flags ?? []);
watch(
    () => props.options.flags,
    (f) => {
        flagValues.value = f ?? [];
    },
);
const ungroupedFlags = getVtfFlagsUngrouped();

const inj = inject(AssetInspectorTextureConvertInjectKey);

function handleToggle(flag: SharedVtfFlag) {
    console.log("toggle", flag);
    const copyFlags = [...flagValues.value];
    const idx = copyFlags.indexOf(flag);
    if (idx > -1) {
        copyFlags.splice(idx, 1);
    } else {
        copyFlags.push(flag);
    }

    flagValues.value = copyFlags;

    inj?.updateOptions({
        flags: toRaw(flagValues.value),
    });
}
</script>

<style scoped></style>
