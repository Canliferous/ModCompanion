<script setup lang="ts">
import { SharedConversionState } from "Shared/SharedConversion.js";

defineProps<{ state: SharedConversionState }>();
</script>

<template>
    <UIcon v-if="state === SharedConversionState.Invalid" name="tdesign:error-triangle-filled" class="text-error" />
    <UIcon v-if="state === SharedConversionState.Unknown" name="lucide:circle-question-mark" class="text-warning" />
    <UIcon v-if="state === SharedConversionState.Pending" name="lucide:dot" class="text-neutral-400" />
    <UIcon v-if="state === SharedConversionState.InProgress" name="tdesign:loading" class="text-info animate-spin" />
    <UIcon v-if="state === SharedConversionState.FinishedConfirmed" name="tdesign:check" class="text-success" />
</template>

<style scoped></style>
