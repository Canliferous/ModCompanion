<template>
    <div class="text-xs select-none font-semibold text-magenta-900">
        <div v-if="artifactCloudStore.connected" class="flex gap-1 items-center">
            <UIcon :name="AppDesign.Icons.NetworkConnected" />
            <span>Cloud Connected</span>
        </div>
        <div v-else class="flex gap-1 items-center">
            <UIcon :name="AppDesign.Icons.NetworkDisconnected" />
            <span>Cloud not reachable</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useArtifactCloudStore } from "~/store/ArtifactCloudStore.js";

const artifactCloudStore = useArtifactCloudStore();
</script>

<style scoped></style>
