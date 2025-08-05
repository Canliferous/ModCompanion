<template>
    <div class="grid place-items-center">
        <ConversionStateIcon :state="state" />
    </div>
</template>

<script setup lang="ts">
import { SharedConversionState } from "Shared/SharedConversion.js";
import ConversionStateIcon from "~/components/common/ConversionStateIcon.vue";

defineProps<{ state: SharedConversionState }>();
</script>

<style scoped></style>
