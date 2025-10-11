<template>
    <div class="p-1 h-full grid grid-cols-1 grid-rows-[1fr_auto] gap-2">
        <div class="overflow-y-scroll" ref="scroller">
            <pre class="whitespace-pre-wrap text-sm text-neutral-200">{{ interopStore.log }}</pre>
        </div>

        <div class="flex">
            <UInput
                class="grow"
                :placeholder="interopStore.connected ? 'Enter command' : 'Strata Interop is not connected'"
                :disabled="!interopStore.connected"
                @keydown.enter="handleSubmit"
                v-model="prompt"
            />
            <UButton
                icon="tdesign:send-filled"
                color="neutral"
                variant="ghost"
                :disabled="!prompt"
                @click="handleSubmit"
            />
            <UButton label="Clear" color="neutral" variant="ghost" @click="handleClear" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStrataInteropStore } from "~/store/StrataInteropStore.js";

const interopStore = useStrataInteropStore();

const scroller = useTemplateRef("scroller");

watch(
    () => interopStore.log,
    (value) => {
        if (scroller.value) {
            scroller.value.scrollTop = scroller.value.scrollHeight;
        }
    },
);

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
