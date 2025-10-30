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
        class="text-muted"
    />
    <UIcon
        v-if="state === SharedConversionState.InProgress"
        :name="AppDesign.Icons.ConversionStateInProgress"
        class="text-info"
        :class="{ 'animate-spin': !noAnimation }"
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
    <UIcon
        v-if="state === SharedConversionState.NoChange"
        :name="AppDesign.Icons.ConversionStateNoChange"
        class="text-muted"
    />
</template>

<script setup lang="ts">
import { SharedConversionState } from "Shared/SharedConversion.js";
import { AppDesign } from "~/design/AppDesign.js";

defineProps<{ state: SharedConversionState; noAnimation?: boolean }>();
</script>

<style scoped></style>
