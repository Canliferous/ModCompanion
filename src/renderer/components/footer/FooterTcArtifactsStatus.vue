<template>
    <div class="text-xs select-none">
        <div v-if="tcArtifactsStore.connected" class="text-success flex gap-1 items-center">
            <UIcon :name="AppDesign.Icons.NetworkConnected" />
            <span>TC Cloud Connected</span>
        </div>
        <div v-else class="text-error flex gap-1 items-center">
            <UIcon :name="AppDesign.Icons.NetworkDisconnected" />
            <span>TC Cloud not reachable</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useTcArtifactsStore } from "~/store/TcArtifactsStore.js";

const tcArtifactsStore = useTcArtifactsStore();
</script>

<style scoped></style>
