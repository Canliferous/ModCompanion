<template>
    <UApp>
        <MainLayout>
            <template #page>
                <DockviewVue @ready="handleDockviewReady" />
            </template>
            <template #sidebar><TheSidebar /></template>
            <template #topbar><TheTopBar /></template>
        </MainLayout>
    </UApp>
</template>

<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import TheSidebar from "./sidebar/TheSidebar.vue";
import { DockviewReadyEvent, DockviewVue } from "dockview-vue";
import { usePanelsStore } from "~/store/PanelsStore.js";

const panelsStore = usePanelsStore();

function handleDockviewReady(event: DockviewReadyEvent) {
    panelsStore.api = event.api;
}
</script>

<style scoped></style>
