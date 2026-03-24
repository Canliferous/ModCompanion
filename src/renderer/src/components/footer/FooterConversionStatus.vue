<template>
    <div class="flex items-stretch gap-2 text-xs select-none">
        <span v-if="status === 'idle'" class="text-muted"> Conversion Agent Idle </span>
        <span v-if="status === 'working'" class="text-info flex items-center gap-1">
            <MConversionStateIcon :state="Shared.Conversion.State.InProgress" /> Conversion Agent Busy
        </span>
        <span class="text-muted">
            (<span class="tabular-nums">{{ total }}</span> total)
        </span>
    </div>
</template>

<script setup lang="ts">
import { useAssetConversionStore } from "~/store/AssetConversionStore.js";
import * as Shared from "mod_companion_shared";

const conversionStore = useAssetConversionStore();
const status = computed(() => conversionStore.summary.currentStatus);
const total = computed(() => conversionStore.summary.totalSum);
</script>

<style scoped></style>
