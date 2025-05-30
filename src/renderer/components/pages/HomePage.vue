<template>
    <div>
        <UButton @click="printConfig">Print config</UButton>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getAppConfig } from "../../renderer-config.js";

function printConfig() {
    console.log(getAppConfig());
}
</script>

<style scoped></style>
