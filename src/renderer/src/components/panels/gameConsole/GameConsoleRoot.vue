<template>
    <MPanelRoot no-scroll>
        <MLogArea :text="interopStore.log" />

        <template #footer>
            <div class="flex">
                <UInput
                    v-model="prompt"
                    class="grow"
                    :placeholder="interopStore.connected ? 'Enter command' : 'Game Interop is not connected'"
                    :disabled="!interopStore.connected"
                    @keydown.enter="handleSubmit"
                />
                <UButton
                    :icon="AppDesign.Icons.ActionSend"
                    color="neutral"
                    variant="ghost"
                    :disabled="!prompt"
                    @click="handleSubmit"
                />
                <UButton label="Clear" color="neutral" variant="ghost" @click="handleClear" />
            </div>
        </template>
    </MPanelRoot>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { useGameInteropStore } from "~/store/GameInteropStore.js";

const interopStore = useGameInteropStore();

const prompt = ref("");

function handleSubmit() {
    window.electronAPI.interop.sendCommand(prompt.value);
    interopStore.addToHistory(prompt.value);
    prompt.value = "";
}

function handleClear() {
    interopStore.clearLog();
}
</script>

<style scoped></style>
