<template>
    <div class="flex">
        <UButton
            variant="ghost"
            color="neutral"
            class="text-neutral-400"
            size="sm"
            :icon="AppDesign.Icons.SystemMinimize"
            @click="handleMinimize"
        />
        <UButton
            variant="ghost"
            color="neutral"
            class="text-neutral-400"
            size="sm"
            :icon="AppDesign.Icons.SystemMaximize"
            @click="handleMaximize"
        />
        <UTooltip text="Hold Shift to fully close">
            <UButton
                variant="ghost"
                color="neutral"
                class="text-neutral-400 hover:bg-error-500 hover:text-neutral-900 active:bg-error-700"
                size="sm"
                :icon="AppDesign.Icons.SystemClose"
                @click="handleClose"
            />
        </UTooltip>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";

function handleMinimize(): void {
    window.electronAPI.app.minimize();
}
function handleMaximize(): void {
    window.electronAPI.app.toggleMaximized();
}
function handleClose(event: MouseEvent): void {
    if (event.shiftKey) {
        window.electronAPI.app.exitForReal();
    } else {
        window.electronAPI.app.closeWindow();
    }
}
</script>

<style scoped></style>
