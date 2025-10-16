<template>
    <div class="w-full h-full relative grid place-items-center">
        <img src="/launch_stuff.svg" class="w-100 absolute bottom-2 left-5" />

        <div class="rounded-xl inset-shadow-cave bg-neutral-900 px-10 py-10 grid gap-7">
            <div class="font-semibold text-center">Add Panel</div>

            <div class="grid grid-cols-3 gap-2">
                <template v-for="panel in panels">
                    <UButton
                        :label="PanelTitles[panel.componentId]"
                        :icon="PanelIcons[panel.componentId]"
                        size="xl"
                        @click="panelsStore.trySpawnPanel(panel)"
                    />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PanelComponents, PanelIcons, PanelTitles } from "~/helper/PanelComponents.js";
import { usePanelsStore } from "~/store/PanelsStore.js";

const panelsStore = usePanelsStore();

const panels = Object.values(PanelComponents.panels);
</script>

<style scoped></style>
