<template>
    <UButtonGroup class="h-full inline-flex gap-1">
        <UButton
            :icon="AppDesign.Icons.ActionPlay"
            :color="compileStore.state !== Shared.PlayPauseStop.State.Playing ? 'success' : 'neutral'"
            :disabled="compileStore.state === Shared.PlayPauseStop.State.Playing"
            @click="compileStore.state = Shared.PlayPauseStop.State.Playing"
        />
        <UButton
            :icon="AppDesign.Icons.ActionPause"
            :color="compileStore.state === Shared.PlayPauseStop.State.Playing ? 'warning' : 'neutral'"
            :disabled="compileStore.state !== Shared.PlayPauseStop.State.Playing"
            @click="compileStore.state = Shared.PlayPauseStop.State.Paused"
        />
        <UButton
            :icon="AppDesign.Icons.ActionStop"
            :color="compileStore.state !== Shared.PlayPauseStop.State.Stopped ? 'error' : 'neutral'"
            :disabled="compileStore.state === Shared.PlayPauseStop.State.Stopped"
            @click="compileStore.state = Shared.PlayPauseStop.State.Stopped"
        />
    </UButtonGroup>
</template>

<script setup lang="ts">
import { useMapCompileStore } from "~/store/MapCompileStore.js";
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";

const compileStore = useMapCompileStore();
</script>

<style scoped></style>
