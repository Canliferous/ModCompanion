<template>
    <div class="grid place-items-center">
        <MConversionStateIcon :state="state" />
    </div>
</template>

<script setup lang="ts">
import MConversionStateIcon from "~/components/common/MConversionStateIcon.vue";
import * as Shared from "mod_companion_shared";

defineProps<{ state: Shared.Conversion.State }>();
</script>

<style scoped></style>
