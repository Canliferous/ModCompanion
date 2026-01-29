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
import { TakeOverId, useTakeOverStore } from "~/store/TakeOverStore.js";

const takeOverStore = useTakeOverStore();

function handleClick(): void {
    takeOverStore.open(TakeOverId.AssetWizard);
}
</script>

<style scoped></style>
