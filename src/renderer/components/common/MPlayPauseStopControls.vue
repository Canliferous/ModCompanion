<template>
    <UButtonGroup class="h-full inline-flex gap-1">
        <UButton
            :icon="AppDesign.Icons.ActionPlay"
            :color="compileStore.state !== SharedPlayPauseStopControlsState.Playing ? 'success' : 'neutral'"
            @click="compileStore.state = SharedPlayPauseStopControlsState.Playing"
            :disabled="compileStore.state === SharedPlayPauseStopControlsState.Playing"
        />
        <UButton
            :icon="AppDesign.Icons.ActionPause"
            :color="compileStore.state === SharedPlayPauseStopControlsState.Playing ? 'warning' : 'neutral'"
            @click="compileStore.state = SharedPlayPauseStopControlsState.Paused"
            :disabled="compileStore.state !== SharedPlayPauseStopControlsState.Playing"
        />
        <UButton
            :icon="AppDesign.Icons.ActionStop"
            :color="compileStore.state !== SharedPlayPauseStopControlsState.Stopped ? 'error' : 'neutral'"
            @click="compileStore.state = SharedPlayPauseStopControlsState.Stopped"
            :disabled="compileStore.state === SharedPlayPauseStopControlsState.Stopped"
        />
    </UButtonGroup>
</template>

<script setup lang="ts">
import { useMapCompileStore } from "~/store/MapCompileStore.js";
import { AppDesign } from "~/design/AppDesign.js";
import { SharedPlayPauseStopControlsState } from "Shared/SharedPlayPauseStopState.js";

const compileStore = useMapCompileStore();
</script>

<style scoped></style>
