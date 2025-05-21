<template>
    <div class="inline-flex gap-1">
        <UButton
            icon="i-bx-play"
            :variant="model !== State.Playing ? 'solid' : 'soft'"
            :color="model !== State.Playing ? 'info' : 'neutral'"
            @click="model = State.Playing"
            :disabled="model === State.Playing"
        />
        <UButton
            icon="i-bx-pause"
            :variant="model === State.Playing ? 'solid' : 'soft'"
            :color="model === State.Playing ? 'info' : 'neutral'"
            @click="model = State.Paused"
            :disabled="model !== State.Playing"
        />
        <UButton
            icon="i-bx-stop"
            :variant="model !== State.Stopped ? 'solid' : 'soft'"
            :color="model !== State.Stopped ? 'error' : 'neutral'"
            @click="model = State.Stopped"
            :disabled="model === State.Stopped"
        />
    </div>
</template>

<script setup lang="ts">
import { State } from "./PlayPauseStopControls.model";
const model = defineModel<State>();
</script>

<style scoped></style>
