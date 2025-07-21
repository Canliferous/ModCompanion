<template>
    <aside class="bg-default h-full flex flex-col">
        <div class="grow grid gap-1 content-start">
            <UButton
                v-for="btn of pageButtons"
                variant="soft"
                color="neutral"
                active-color="primary"
                class="border-l-4 active:border-l-primary"
                :to="btn.route"
                :leading-icon="btn.icon"
            >
                {{ btn.name }}
            </UButton>

            <USeparator />

            <UDropdownMenu :items="items" :content="{ side: 'right', align: 'start' }">
                <UButton :ui="{ item: 'py-0' }" variant="soft" color="neutral" label="Add Panel" icon="tdesign:plus" />
            </UDropdownMenu>
        </div>

        <div class="grid gap-1 content-start">
            <SidebarHotReloadSwitch />
            <USeparator />
            <UButton
                v-for="btn of launcherButtons"
                :color="btn.color"
                @click="() => launch(btn.launcherType, btn.launcherArgs)"
                :label="btn.name"
                size="small"
                variant="soft"
            >
                <template #leading>
                    <BitmapIcon :name="btn.icon" class="size-4 mx-2" />
                </template>
            </UButton>

            <USeparator />
            <UButton size="small" variant="soft" color="neutral" label="Quit Sibelius" @click="() => quit()">
                <template #leading>
                    <UIcon class="h-4 mx-2" name="tdesign:close-rectangle-filled" />
                </template>
            </UButton>
        </div>
    </aside>
</template>

<script setup lang="ts">
import BitmapIcon from "../common/BitmapIcon.vue";
import { launch, launcherButtons } from "~/model/LauncherButtons.js";
import AppDesign from "../../design/AppDesign.js";
import SidebarHotReloadSwitch from "~/components/sidebar/SidebarHotReloadSwitch.vue";
import { usePanelsStore } from "~/store/PanelsStore.js";
import { DropdownMenuItem } from "@nuxt/ui/components/DropdownMenu.vue.js";
import { getPanelConfig } from "~/renderer-panels.js";

const panelsStore = usePanelsStore();

const items = getPanelConfig().map(
    (p) =>
        ({
            label: p.title,
            onSelect(e: Event) {
                panelsStore.api?.addPanel({
                    id: new Date().getTime() + "",
                    component: p.panelId,
                    title: p.title,
                });
            },
        }) satisfies DropdownMenuItem,
);

function quit() {
    window.electronAPI.app.exit();
}

interface PageButton {
    name: string;
    icon: string;
    route: string;
}

const pageButtons: PageButton[] = [
    {
        name: "Home",
        icon: "tdesign:home-filled",
        route: "/",
    },
    {
        name: "Assets",
        icon: AppDesign.icons.asset,
        route: "/assets",
    },
    {
        name: "Loose Files",
        icon: "tdesign:file-filled",
        route: "/loose",
    },
    {
        name: "Maps",
        icon: "tdesign:map-3d-filled",
        route: "/maps",
    },
];
</script>

<style scoped></style>
