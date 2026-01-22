<template>
    <UButton
        label="Create Asset"
        :icon="AppDesign.Icons.ActionCreateAsset"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="handleClick"
    />
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";

function handleClick(): void {}
</script>

<style scoped></style>
