<template>
    <UBadge
        :label="getConversionStateName(state)"
        :color="getConversionStateColor(state)"
        :variant="variant ?? 'subtle'"
    >
        <template #leading>
            <MConversionStateIcon :state="state" :no-animation="noAnimation" />
        </template>
    </UBadge>
</template>

<script setup lang="ts">
import { getConversionStateColor, getConversionStateName, SharedConversionState } from "Shared/SharedConversion.js";

defineProps<{ state: SharedConversionState; variant?: string; noAnimation?: boolean }>();
</script>

<style scoped></style>
