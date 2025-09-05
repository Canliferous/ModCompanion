<template>
    <UTooltip text="Conversion State">
        <UBadge
            :label="getConversionStateName(state)"
            :color="getConversionStateColor(state)"
            :variant="variant ?? 'subtle'"
        >
            <template #leading>
                <ConversionStateIcon :state="state" />
            </template>
        </UBadge>
    </UTooltip>
</template>

<script setup lang="ts">
import { getConversionStateColor, getConversionStateName, SharedConversionState } from "Shared/SharedConversion.js";

defineProps<{ state: SharedConversionState; variant?: string }>();
</script>

<style scoped></style>
