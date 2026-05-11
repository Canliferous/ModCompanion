<template>
    <UApp>
        <div class="grid main-layout h-screen bg-neutral-925">
            <div>
                <TheSidebar />
            </div>
            <div class="h-full grid grid-cols-1 grid-rows-1 p-1 relative">
                <DockviewVue
                    :theme="themeModcomp"
                    :watermark-component="GlobalComponentNames.Watermark"
                    :left-header-actions-component="GlobalComponentNames.AddPanelAction"
                    :default-tab-component="GlobalComponentNames.PanelTab"
                    default-renderer="onlyWhenVisible"
                    @ready="panelsStore.handleReady"
                />

                <!-- Register takeovers here -->
                <MessageLogTakeOver />
                <AssetWizardTakeOver />
            </div>
            <TheFooter />
        </div>
    </UApp>
</template>

<script setup lang="ts">
import TheSidebar from "./sidebar/TheSidebar.vue";
import { DockviewVue } from "dockview-vue";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { themeModcomp } from "~/design/ModcompDockviewTheme.js";
import { GlobalComponentNames } from "~/helper/GlobalComponents.js";

const panelsStore = usePanelsStore();
</script>

<style scoped>
.main-layout {
    grid-template-columns: 10rem minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) 2.2rem;
}
</style>
