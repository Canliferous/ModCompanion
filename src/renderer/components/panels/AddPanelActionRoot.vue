<template>
    <div class="h-full flex items-center">
        <UPopover v-model:open="open" :content="{ side: 'bottom', align: 'start' }" arrow>
            <UButton :icon="AppDesign.Icons.ActionAdd" variant="ghost" />

            <template #content>
                <div class="p-2">
                    <MAddPanelsGrid :spawnOptions="spawnOptions" @buttonClicked="handleClicked" />
                </div>
            </template>
        </UPopover>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import MAddPanelsGrid from "~/components/common/MAddPanelsGrid.vue";
import { AddPanelOptions } from "dockview-core/dist/cjs/dockview/options.js";

const props = defineProps<{ params: any }>();
const spawnOptions: Partial<AddPanelOptions> = {
    position: {
        referenceGroup: props.params.group,
    },
};

const open = ref(false);
function handleClicked() {
    open.value = false;
}
</script>

<style scoped></style>
