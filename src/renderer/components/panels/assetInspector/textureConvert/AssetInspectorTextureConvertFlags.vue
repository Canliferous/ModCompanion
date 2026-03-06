<template>
    <template v-for="group in grouping.groups" :key="group.label">
        <AssetInspectorTextureConvertFlagsGroup
            :label="group.label"
            :flags="group.items"
            :values="flagValues"
            @toggle="handleToggle"
        />
    </template>
    <template v-if="grouping.ungrouped.length > 0">
        <AssetInspectorTextureConvertFlagsGroup
            label="Other Flags"
            :flags="grouping.ungrouped"
            :values="flagValues"
            @toggle="handleToggle"
        />
    </template>
</template>

<script setup lang="ts">
import { SharedVtfCreateOptions } from "Shared/SharedVtf.js";
import { getVtfFlagGrouping, SharedVtfFlag } from "Shared/vtf/SharedVtfFlag.js";
import { AssetInspectorTextureConvertInjectKey } from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvert.model.js";

const props = defineProps<{ options: SharedVtfCreateOptions }>();
const flagValues = ref(props.options.flags ?? []);
watch(
    () => props.options.flags,
    (f) => {
        flagValues.value = f ?? [];
    },
);
const grouping = getVtfFlagGrouping();

const inj = inject(AssetInspectorTextureConvertInjectKey);

function handleToggle(flag: SharedVtfFlag) {
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
