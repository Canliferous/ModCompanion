<template>
    <UIcon :name="iconName" :class="getAssetTypeTextColor(type)" />
</template>

<script setup lang="ts">
import { getAssetTypeIcon, getAssetTypeTextColor } from "~/design/AppDesign.js";
import { computed } from "vue";
import * as Shared from "mod_companion_shared";

const props = defineProps<{
    type: Shared.Asset.Type;
}>();
const iconName = computed(() => getAssetTypeIcon(props.type));
</script>

<style scoped></style>
