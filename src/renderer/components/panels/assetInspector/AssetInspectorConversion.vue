<template>
    <ConversionStateBadge :state="state" />
</template>

<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";
import ConversionStateIcon from "~/components/common/ConversionStateIcon.vue";
import { getConversionStateName } from "Shared/SharedConversion.js";

const props = defineProps<{ assetId: SharedAssetId }>();

const conversionStore = useAssetConversionStore();
const state = computed(() => conversionStore.getState(props.assetId));
</script>

<style scoped></style>
