<template>
    <div class="flex gap-1">
        <MConversionStateBadge :state="state" />
        <UButton label="Convert" size="sm" :trailing-icon="AppDesign.Icons.ActionConvertAsset" @click="handleClick" />
    </div>
</template>

<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";
import { AppDesign } from "~/design/AppDesign.js";

const props = defineProps<{ assetId: SharedAssetId }>();

const conversionStore = useAssetConversionStore();
const state = computed(() => conversionStore.getState(props.assetId));

function handleClick(): void {
    useAssetConversionStore().enqueue(props.assetId);
}
</script>

<style scoped></style>
