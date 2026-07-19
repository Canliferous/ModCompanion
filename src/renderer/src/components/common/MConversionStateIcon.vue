<template>
    <UIcon
        v-if="state === Shared.Conversion.State.Invalid"
        :name="AppDesign.Icons.ConversionStateInvalid"
        class="text-error"
    />
    <UIcon
        v-if="state === Shared.Conversion.State.Unknown"
        :name="AppDesign.Icons.ConversionStateUnknown"
        class="text-warning"
    />
    <UIcon
        v-if="state === Shared.Conversion.State.Pending || state === Shared.Conversion.State.PendingForced"
        :name="AppDesign.Icons.ConversionStatePending"
        class="text-muted"
    />
    <UIcon
        v-if="state === Shared.Conversion.State.InProgress"
        :name="AppDesign.Icons.ConversionStateInProgress"
        class="text-info"
        :class="{ 'animate-spin': !noAnimation }"
    />
    <UIcon
        v-if="state === Shared.Conversion.State.Finished"
        :name="AppDesign.Icons.ConversionStateFinished"
        class="text-success"
    />
    <UIcon
        v-if="state === Shared.Conversion.State.Failed"
        :name="AppDesign.Icons.ConversionStateFailed"
        class="text-error"
    />
    <UIcon
        v-if="state === Shared.Conversion.State.NoChange"
        :name="AppDesign.Icons.ConversionStateNoChange"
        class="text-muted"
    />
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";

defineProps<{ state: Shared.Conversion.State; noAnimation?: boolean }>();
</script>

<style scoped></style>
