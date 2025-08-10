<template>
    <div class="flex items-center h-full gap-1 px-1">
        <UIcon :name="params.params.icon" />
        <span>{{ title }}</span>
    </div>
</template>

<script setup lang="ts">
import { IDockviewPanelHeaderProps } from "dockview-vue";

const props = defineProps<{ params: IDockviewPanelHeaderProps }>();

const title = ref(props.params.api.title);
props.params.api.onDidTitleChange((e) => {
    title.value = e.title;
});
</script>

<style scoped></style>
