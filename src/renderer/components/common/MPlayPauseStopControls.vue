<template>
    <div class="h-full inline-flex gap-1">
        <UButton
            :icon="AppDesign.Icons.ActionPlay"
            :variant="compileStore.state !== State.Playing ? 'solid' : 'soft'"
            :color="compileStore.state !== State.Playing ? 'info' : 'neutral'"
            @click="compileStore.state = State.Playing"
            :disabled="compileStore.state === State.Playing"
            size="xl"
            class="p-0 h-full aspect-square justify-center"
        />
        <UButton
            :icon="AppDesign.Icons.ActionPause"
            :variant="compileStore.state === State.Playing ? 'solid' : 'soft'"
            :color="compileStore.state === State.Playing ? 'warning' : 'neutral'"
            @click="compileStore.state = State.Paused"
            :disabled="compileStore.state !== State.Playing"
            size="xl"
            class="p-0 h-full aspect-square justify-center"
        />
        <UButton
            :icon="AppDesign.Icons.ActionStop"
            :variant="compileStore.state !== State.Stopped ? 'solid' : 'soft'"
            :color="compileStore.state !== State.Stopped ? 'error' : 'neutral'"
            @click="compileStore.state = State.Stopped"
            :disabled="compileStore.state === State.Stopped"
            size="xl"
            class="p-0 h-full aspect-square justify-center"
        />
    </div>
</template>

<script setup lang="ts">
import { State } from "./MPlayPauseStopControls.model.js";
import { useMapCompileStore } from "~/store/MapCompileStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const compileStore = useMapCompileStore();
</script>

<style scoped></style>
