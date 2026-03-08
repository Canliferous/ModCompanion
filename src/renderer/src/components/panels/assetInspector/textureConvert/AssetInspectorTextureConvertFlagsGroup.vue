<template>
    <UCollapsible v-model:open="open" class="col-span-2">
        <UButton
            :label="label"
            variant="ghost"
            color="neutral"
            :icon="open ? AppDesign.Icons.ChevronUp : AppDesign.Icons.ChevronDown"
            block
            class="justify-start"
        />

        <template #content>
            <div class="grid grid-cols-2 gap-2 p-2">
                <template v-for="flag in flags" :key="flag">
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
import AssetInspectorTextureConvertFlagsGroupCheckbox from "~/components/panels/assetInspector/textureConvert/AssetInspectorTextureConvertFlagsGroupCheckbox.vue";
import { useRememberRef } from "~/composables/useRemember.js";
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";

const props = defineProps<{ label: string; flags: Shared.Vtf.SharedVtfFlag[]; values: Shared.Vtf.SharedVtfFlag[] }>();
const emit = defineEmits<{ toggle: [flag: Shared.Vtf.SharedVtfFlag] }>();

const open = useRememberRef(ref(false), "texture-flags-group-open-" + props.label);
</script>

<style scoped></style>
