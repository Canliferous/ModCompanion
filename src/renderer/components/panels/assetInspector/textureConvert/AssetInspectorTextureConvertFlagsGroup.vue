<template>
    <UFormField :label="label" class="col-span-2">
        <div class="grid grid-cols-2 gap-2">
            <template v-for="flag in flags">
                <AssetInspectorTextureConvertFlagsGroupCheckbox
                    :checked="values.includes(flag)"
                    :flag="flag"
                    @toggle="(f) => emit('toggle', f)"
                />
            </template>
        </div>
    </UFormField>
</template>

<script setup lang="ts">
import { SharedVtfFlag } from "Shared/vtf/SharedVtfFlag.js";
import AssetInspectorTextureConvertFlagsGroupCheckbox from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvertFlagsGroupCheckbox.vue";

const props = defineProps<{ label: string; flags: SharedVtfFlag[]; values: SharedVtfFlag[] }>();
const emit = defineEmits<{ toggle: [flag: SharedVtfFlag] }>();
</script>

<style scoped></style>
