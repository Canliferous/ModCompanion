<template>
    <UIcon
        v-if="state === SharedConversionState.Invalid"
        :name="AppDesign.Icons.ConversionStateInvalid"
        class="text-error"
    />
    <UIcon
        v-if="state === SharedConversionState.Unknown"
        :name="AppDesign.Icons.ConversionStateUnknown"
        class="text-warning"
    />
    <UIcon
        v-if="state === SharedConversionState.Pending || state === SharedConversionState.PendingForced"
        :name="AppDesign.Icons.ConversionStatePending"
        class="text-neutral-400"
    />
    <UIcon
        v-if="state === SharedConversionState.InProgress"
        :name="AppDesign.Icons.ConversionStateInProgress"
        class="text-info animate-spin"
    />
    <UIcon
        v-if="state === SharedConversionState.Finished"
        :name="AppDesign.Icons.ConversionStateFinished"
        class="text-success"
    />
    <UIcon
        v-if="state === SharedConversionState.Failed"
        :name="AppDesign.Icons.ConversionStateFailed"
        class="text-error"
    />
</template>

<script setup lang="ts">
import { SharedConversionState } from "Shared/SharedConversion.js";
import { AppDesign } from "~/design/AppDesign.js";

defineProps<{ state: SharedConversionState }>();
</script>

<style scoped></style>
