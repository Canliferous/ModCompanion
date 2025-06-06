<template>
    <div>
        <UButton @click="printConfig" variant="subtle">Print config</UButton>
    </div>
</template>

<script setup lang="ts">
import { getAppConfig } from "../../renderer-config.js";

function printConfig() {
    console.log(getAppConfig());
}
</script>

<style scoped></style>
