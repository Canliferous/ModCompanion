<template>
    <!-- Dockview has z-index of 99 so we must be above it -->
    <div
        class="flex h-full bg-neutral-950/50 backdrop-blur-md absolute inset-0 p-1 transition-opacity overflow-y-clip"
        :class="{
            'opacity-100 pointer-events-auto': isOpen,
            'opacity-0 pointer-events-none': !isOpen,
        }"
        @click.self="takeOverStore.close()"
    >
        <div
            class="grow bg-neutral-850/50 inset-shadow-rim rounded shadow max-h-full grid grid-rows-[auto_auto_minmax(0,1fr)] content-start items-start p-1 gap-1 transition-transform"
            :class="{
                'translate-y-0': isOpen,
                'translate-y-50': !isOpen,
                grow: full,
            }"
        >
            <div class="flex items-center gap-2">
                <span class="pl-1 text-sm select-none flex gap-1">
                    <!-- Awkward transform because items-center doesn't center these icons optically -->
                    <UIcon :name="TakeOverConfig[id].icon" class="translate-y-0.5" />
                    <span>{{ TakeOverConfig[id].name }}</span>
                </span>

                <div class="grow" />

                <slot name="toolbar" />
                <UButton
                    :icon="AppDesign.Icons.ActionMinimize"
                    variant="ghost"
                    size="sm"
                    @click="takeOverStore.close()"
                />
            </div>

            <USeparator />

            <slot name="default" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import { TakeOverConfig, TakeOverId, useTakeOverStore } from "~/store/TakeOverStore.js";

const takeOverStore = useTakeOverStore();

const props = defineProps<{ id: TakeOverId; full?: boolean }>();

defineSlots<{
    toolbar: any;
    default: any;
}>();

const isOpen = computed(() => takeOverStore.isOpen(props.id));
</script>

<style scoped></style>
