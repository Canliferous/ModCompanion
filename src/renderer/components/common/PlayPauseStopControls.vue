<template>
    <div class="h-full inline-flex gap-1">
        <UButton
            icon="tdesign:play"
            :variant="model !== State.Playing ? 'solid' : 'soft'"
            :color="model !== State.Playing ? 'info' : 'neutral'"
            @click="model = State.Playing"
            :disabled="model === State.Playing"
            size="xl"
            class="p-0 h-full aspect-square justify-center"
        />
        <UButton
            icon="tdesign:pause"
            :variant="model === State.Playing ? 'solid' : 'soft'"
            :color="model === State.Playing ? 'info' : 'neutral'"
            @click="model = State.Paused"
            :disabled="model !== State.Playing"
            size="xl"
            class="p-0 h-full aspect-square justify-center"
        />
        <UButton
            icon="tdesign:stop"
            :variant="model !== State.Stopped ? 'solid' : 'soft'"
            :color="model !== State.Stopped ? 'error' : 'neutral'"
            @click="model = State.Stopped"
            :disabled="model === State.Stopped"
            size="xl"
            class="p-0 h-full aspect-square justify-center"
        />
    </div>
</template>

<script setup lang="ts">
import { State } from "./PlayPauseStopControls.model";
const model = defineModel<State>();
</script>

<style scoped></style>
