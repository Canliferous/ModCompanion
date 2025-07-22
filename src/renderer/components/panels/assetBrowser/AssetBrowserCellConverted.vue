<template>
    <div class="grid place-items-center">
        <UIcon v-if="state === SharedConversionState.Unknown" name="tdesign:close" class="text-error" />
        <UIcon v-if="state === SharedConversionState.Pending" name="lucide:dot" class="text-neutral-400" />
        <UIcon
            v-if="state === SharedConversionState.InProgress"
            name="tdesign:loading"
            class="text-info animate-spin"
        />
        <UIcon v-if="state === SharedConversionState.FinishedConfirmed" name="tdesign:check" class="text-success" />
    </div>
</template>

<script setup lang="ts">
import { SharedConversionState } from "Shared/SharedConversion.js";

defineProps<{ state: SharedConversionState }>();
</script>

<style scoped></style>
