<template>
    <!-- Dockview has z-index of 99 so we must be above it -->
    <div
        class="bg-neutral-950/50 backdrop-blur-md absolute inset-0 p-1 flex flex-col justify-end transition-opacity z-100 overflow-y-clip"
        :class="{
            'opacity-100 pointer-events-auto': open,
            'opacity-0 pointer-events-none': !open,
        }"
        @click.self="emit('close')"
    >
        <div
            class="bg-neutral-850/50 inset-shadow-rim rounded shadow max-h-full grid grid-row-[auto_auto_minmax(0,1fr)] p-1 gap-1 transition-transform"
            :class="{
                'translate-y-0': open,
                'translate-y-50': !open,
            }"
        >
            <div class="flex items-center gap-2">
                <span class="pl-1 text-sm select-none flex gap-1">
                    <UIcon :name="icon" />
                    <span>{{ label }}</span>
                </span>

                <div class="grow" />

                <slot name="toolbar" />
                <UButton :icon="AppDesign.Icons.ActionMinimize" variant="ghost" size="sm" @click="emit('close')" />
            </div>

            <slot name="default" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";

const props = defineProps<{ open: boolean; label: string; icon: string }>();

defineSlots<{
    toolbar: any;
    default: any;
}>();

const emit = defineEmits<{ close: [void] }>();
</script>

<style scoped></style>
