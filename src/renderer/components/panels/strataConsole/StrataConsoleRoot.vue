<template>
    <MPanelRoot noScroll>
        <MLogArea :text="interopStore.log" />

        <template #footer>
            <div class="flex">
                <UInput
                    class="grow"
                    :placeholder="interopStore.connected ? 'Enter command' : 'Strata Interop is not connected'"
                    :disabled="!interopStore.connected"
                    @keydown.enter="handleSubmit"
                    v-model="prompt"
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
import { useStrataInteropStore } from "~/store/StrataInteropStore.js";
import { AppDesign } from "~/design/AppDesign.js";

const interopStore = useStrataInteropStore();

const prompt = ref("");

function handleSubmit() {
    window.electronAPI.interop.sendCommand(prompt.value);
    interopStore.addToHistory(prompt.value);
    prompt.value = "";
}

function handleHistoryUp() {
    const newPrompt = interopStore.getHistoryUp(prompt.value);
    if (newPrompt) {
        prompt.value = newPrompt;
    }
}

function handleHistoryDown() {
    const newPrompt = interopStore.getHistoryDown(prompt.value);
    if (newPrompt) {
        prompt.value = newPrompt;
    }
}

function handleClear() {
    interopStore.clearLog();
}
</script>

<style scoped></style>
