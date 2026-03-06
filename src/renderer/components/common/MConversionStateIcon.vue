<template>
    <UIcon v-if="state === State.Invalid" :name="AppDesign.Icons.ConversionStateInvalid" class="text-error" />
    <UIcon v-if="state === State.Unknown" :name="AppDesign.Icons.ConversionStateUnknown" class="text-warning" />
    <UIcon
        v-if="state === State.Pending || state === State.PendingForced"
        :name="AppDesign.Icons.ConversionStatePending"
        class="text-muted"
    />
    <UIcon
        v-if="state === State.InProgress"
        :name="AppDesign.Icons.ConversionStateInProgress"
        class="text-info"
        :class="{ 'animate-spin': !noAnimation }"
    />
    <UIcon v-if="state === State.Finished" :name="AppDesign.Icons.ConversionStateFinished" class="text-success" />
    <UIcon v-if="state === State.Failed" :name="AppDesign.Icons.ConversionStateFailed" class="text-error" />
    <UIcon v-if="state === State.NoChange" :name="AppDesign.Icons.ConversionStateNoChange" class="text-muted" />
</template>

<script setup lang="ts">
import { State } from "Shared/SharedConversion.js";
import { AppDesign } from "~/design/AppDesign.js";

defineProps<{ state: State; noAnimation?: boolean }>();
</script>

<style scoped></style>
