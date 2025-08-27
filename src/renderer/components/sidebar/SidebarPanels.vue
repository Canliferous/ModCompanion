<template>
    <UDropdownMenu :items="items" :content="{ side: 'bottom', align: 'start' }">
        <UButton :ui="{ item: 'py-0' }" variant="soft" color="neutral" label="Panels" icon="tdesign:component-layout" />
    </UDropdownMenu>
</template>

<script setup lang="ts">
import { DropdownMenuItem } from "@nuxt/ui/components/DropdownMenu.vue.js";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { getPanelComponentsArray, PanelComponents, PanelIcons, PanelTitles } from "~/helper/PanelComponents.js";

const panelsStore = usePanelsStore();

const items = Object.values(PanelComponents.panels).map((p) => {
    const item: DropdownMenuItem = {
        label: PanelTitles[p.componentId],
        icon: PanelIcons[p.componentId] ?? "nothing",
        onSelect(e: Event) {
            panelsStore.togglePanel(p);
        },
    };

    return item;
});
</script>

<style scoped></style>
