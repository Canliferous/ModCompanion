<template>
    <div class="flex items-center h-full gap-1" @mousedown.middle="handleClose">
        <UIcon :name="params.params.icon" />
        <span>{{ title }}</span>
        <UButton
            v-if="!props.params.params.noClose"
            :icon="AppDesign.Icons.Close"
            variant="link"
            size="xs"
            class="p-0"
            @click="handleClose"
        />
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";

import { IDockviewPanelHeaderProps } from "dockview-vue";

const props = defineProps<{ params: IDockviewPanelHeaderProps }>();

const title = ref(props.params.api.title);
props.params.api.onDidTitleChange((e) => {
    title.value = e.title;
});

function handleClose() {
    if (!props.params.params.noClose) {
        props.params.api.close();
    }
}
</script>

<style scoped></style>
