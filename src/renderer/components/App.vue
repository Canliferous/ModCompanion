<template>
    <UApp>
        <MainLayout>
            <template #page>
                <DockviewVue @ready="panelsStore.handleReady" :theme="themeDark" />
            </template>
            <template #sidebar><TheSidebar /></template>
        </MainLayout>
    </UApp>
</template>

<script setup lang="ts">
import MainLayout from "./MainLayout.vue";
import TheSidebar from "./sidebar/TheSidebar.vue";
import { DockviewReadyEvent, DockviewVue, themeDark } from "dockview-vue";
import { usePanelsStore } from "~/store/PanelsStore.js";

const panelsStore = usePanelsStore();
</script>

<style scoped></style>
