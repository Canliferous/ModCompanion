<script setup lang="ts">
import { SharedAssetType } from "Shared/SharedAsset.js";
import { getIconForAssetType } from "~/design/AppDesign.js";
import { computed } from "vue";

const props = defineProps<{
    type: SharedAssetType;
}>();
const iconName = computed(() => getIconForAssetType(props.type));
</script>

<template>
    <UIcon :name="iconName" />
</template>

<style scoped></style>
