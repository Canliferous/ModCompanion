<template>
    <UButton
        variant="ghost"
        size="sm"
        label="Edit Sign Config"
        :icon="AppDesign.Icons.TakeOver_ChamberSign"
        @click="handleClick"
    />
</template>

<script setup lang="ts">
import { TakeOverId, useTakeOverStore } from "~/store/TakeOverStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const takeOverStore = useTakeOverStore();

function handleClick(): void {
    takeOverStore.open(TakeOverId.ChamberSignConfig);
}
</script>

<style scoped></style>
