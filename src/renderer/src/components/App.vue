<template>
    <UApp>
        <div class="grid grid-cols-1 grid-rows-[auto_1fr_auto] h-screen bg-neutral-925">
            <TheTopbar />
            <div class="h-full grid grid-cols-1 grid-rows-1 p-1 relative">
                <DockviewVue
                    :theme="themeModcomp"
                    :watermark-component="GlobalComponentNames.Watermark"
                    :left-header-actions-component="GlobalComponentNames.AddPanelAction"
                    :default-tab-component="GlobalComponentNames.PanelTab"
                    default-renderer="onlyWhenVisible"
                    @ready="panelsStore.handleReady"
                />
                <TheTakeOvers />
            </div>
            <TheFooter />
        </div>
    </UApp>
</template>

<script setup lang="ts">
import TheTopbar from "~/components/topbar/TheTopbar.vue";
import { DockviewVue } from "dockview-vue";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { themeModcomp } from "~/design/ModcompDockviewTheme.js";
import { GlobalComponentNames } from "~/helper/GlobalComponents.js";

const panelsStore = usePanelsStore();
</script>
