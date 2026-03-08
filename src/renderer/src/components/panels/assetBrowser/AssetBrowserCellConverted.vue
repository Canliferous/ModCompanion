<template>
    <div class="grid place-items-center">
        <MConversionStateIcon :state="state" />
    </div>
</template>

<script setup lang="ts">
import { State } from "Shared/SharedConversion.js";
import MConversionStateIcon from "~/components/common/MConversionStateIcon.vue";

defineProps<{ state: State }>();
</script>

<style scoped></style>
