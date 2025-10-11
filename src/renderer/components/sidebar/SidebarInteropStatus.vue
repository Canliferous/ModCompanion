<template>
    <div class="text-center text-sm select-none">
        <div v-if="interopStore.connected" class="p-0.5 bg-green-900 text-green-300">Interop: Connected</div>
        <div v-else class="p-0.5 bg-neutral-800 text-neutral-400">Interop: Idle</div>
    </div>
</template>

<script setup lang="ts">
import { useStrataInteropStore } from "~/store/StrataInteropStore.js";

const interopStore = useStrataInteropStore();
</script>

<style scoped></style>
