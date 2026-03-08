<template>
    <UBadge
        :label="Shared.Conversion.getConversionStateName(state)"
        :color="Shared.Conversion.getConversionStateColor(state)"
        :variant="variant ?? 'subtle'"
    >
        <template #leading>
            <MConversionStateIcon :state="state" :no-animation="noAnimation" />
        </template>
    </UBadge>
</template>

<script setup lang="ts">
import * as Shared from "mod_companion_shared";

defineProps<{ state: Shared.Conversion.State; variant?: string; noAnimation?: boolean }>();
</script>

<style scoped></style>
