<template>
    <div class="flex gap-1">
        <MConversionStateBadge :state="state" />
        <UButton label="Convert" variant="ghost" size="sm" color="success" icon="tdesign:play" @click="handleClick" />
    </div>
</template>

<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import { SharedAssetId } from "Shared/SharedAssetDefinition.js";

const props = defineProps<{ assetId: SharedAssetId }>();

const conversionStore = useAssetConversionStore();
const state = computed(() => conversionStore.getState(props.assetId));

function handleClick(): void {
    useAssetConversionStore().enqueue(props.assetId);
}
</script>

<style scoped></style>
