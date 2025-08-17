<template>
    <UCollapsible class="col-span-2" v-model:open="open">
        <UButton
            :label="label"
            variant="ghost"
            color="neutral"
            :icon="open ? 'tdesign:chevron-up' : 'tdesign:chevron-down'"
        />

        <template #content>
            <div class="grid grid-cols-2 gap-2 p-2">
                <template v-for="flag in flags">
                    <AssetInspectorTextureConvertFlagsGroupCheckbox
                        :checked="values.includes(flag)"
                        :flag="flag"
                        @toggle="(f) => emit('toggle', f)"
                    />
                </template>
            </div>
        </template>
    </UCollapsible>
</template>

<script setup lang="ts">
import { SharedVtfFlag } from "Shared/vtf/SharedVtfFlag.js";
import AssetInspectorTextureConvertFlagsGroupCheckbox from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvertFlagsGroupCheckbox.vue";
import { useRemember } from "~/composables/useRemember.js";

const props = defineProps<{ label: string; flags: SharedVtfFlag[]; values: SharedVtfFlag[] }>();
const emit = defineEmits<{ toggle: [flag: SharedVtfFlag] }>();

const open = useRemember(ref(false), "texture-flags-group-open-" + props.label);
</script>

<style scoped></style>
