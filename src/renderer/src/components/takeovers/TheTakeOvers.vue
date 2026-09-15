<template>
    <template v-for="takeOver in TakeOverConfig" :key="takeOver.name">
        <component :is="takeOver.component" />
    </template>
</template>

<script setup lang="ts">
import { TakeOverConfig } from "~/store/TakeOverStore.js";
</script>

<style scoped></style>
