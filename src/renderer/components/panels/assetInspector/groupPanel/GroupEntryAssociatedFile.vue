<template>
    <div>
        {{ a }}
    </div>
    <!--    <UButton :label="a?.name" />-->
</template>

<script setup lang="ts">
import { getAssociatedEntryName, SharedAssetDefinitionAssociatedFiles } from "Shared/SharedAssetDefinition.js";

const props = defineProps<{
    associatedFilesKey: keyof SharedAssetDefinitionAssociatedFiles;
}>();

const a = computed(() => getAssociatedEntryName(props.associatedFilesKey));
</script>

<style scoped></style>
