<script setup lang="ts">
import { SharedAssetType } from "Shared/SharedAssetDefinition.js";
import { getAssetTypeIcon } from "~/design/AppDesign.js";
import { computed } from "vue";

const props = defineProps<{
    type: SharedAssetType;
}>();
const iconName = computed(() => getAssetTypeIcon(props.type));
</script>

<template>
    <UIcon :name="iconName" />
</template>

<style scoped></style>
