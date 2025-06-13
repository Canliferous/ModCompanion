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
        </div>

        <div class="grid gap-1 content-start">
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
import { launch, launcherButtons } from "../../model/LauncherButtons.js";
import AppDesign from "../../design/AppDesign.js";

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
        name: "Maps",
        icon: "tdesign:map-3d-filled",
        route: "/maps",
    },
];
</script>

<style scoped></style>
