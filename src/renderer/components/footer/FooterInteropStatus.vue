<template>
    <div class="text-sm select-none">
        <div v-if="interopStore.connected" class="text-success flex gap-1 items-center">
            <UIcon :name="AppDesign.Icons.Check" /> Game Connected
        </div>
        <div v-else class="p-0.5 bg-neutral-800 text-muted">Game Idle</div>
    </div>
</template>

<script setup lang="ts">
import { useStrataInteropStore } from "~/store/StrataInteropStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const interopStore = useStrataInteropStore();
</script>

<style scoped></style>
