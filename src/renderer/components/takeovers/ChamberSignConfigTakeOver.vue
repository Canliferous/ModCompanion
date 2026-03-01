<template>
    <TakeOver :id="TakeOverId.ChamberSignConfig" full>
        <ChamberSignConfigRoot v-model="chamberSignConfigStore.config" />
    </TakeOver>
</template>

<script setup lang="ts">
import { TakeOverId } from "~/store/TakeOverStore.js";
import { useChamberSignConfigStore } from "~/store/ChamberSignConfigStore.js";
import ChamberSignConfigRoot from "~/components/takeovers/chamberSignConfig/ChamberSignConfigRoot.vue";

const chamberSignConfigStore = useChamberSignConfigStore();
</script>

<style scoped></style>
