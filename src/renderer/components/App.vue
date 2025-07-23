<template>
    <UApp>
        <MainLayout>
            <template #page>
                <DockviewVue @ready="handleDockviewReady" :theme="themeDark" />
            </template>
            <template #sidebar><TheSidebar /></template>
            <template #topbar><TheTopBar /></template>
        </MainLayout>
    </UApp>
</template>

<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import TheSidebar from "./sidebar/TheSidebar.vue";
import { DockviewReadyEvent, DockviewVue, themeDark } from "dockview-vue";
import { usePanelsStore } from "~/store/PanelsStore.js";

const panelsStore = usePanelsStore();

function handleDockviewReady(event: DockviewReadyEvent) {
    panelsStore.api = event.api;

    const loadedLayout = localStorage.getItem("panel-layout");
    if (loadedLayout) {
        try {
            const layout = JSON.parse(loadedLayout);
            event.api.fromJSON(layout);
        } catch (err) {
            console.warn("Failed to load layout");
        }
    }

    event.api.onDidLayoutChange((e) => {
        const serialized = event.api.toJSON();
        localStorage.setItem("panel-layout", JSON.stringify(serialized));
    });
}
</script>

<style scoped></style>
