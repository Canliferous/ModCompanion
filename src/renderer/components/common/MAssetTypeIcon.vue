<template>
    <UIcon :name="iconName" :class="getAssetTypeTextColor(type)" />
</template>

<script setup lang="ts">
import { SharedAssetType } from "Shared/SharedAssetDefinition.js";
import { getAssetTypeIcon, getAssetTypeTextColor } from "~/design/AppDesign.js";
import { computed } from "vue";

const props = defineProps<{
    type: SharedAssetType;
}>();
const iconName = computed(() => getAssetTypeIcon(props.type));
</script>

<style scoped></style>
