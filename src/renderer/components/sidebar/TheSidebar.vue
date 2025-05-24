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
                size="small"
                variant="soft"
                color="neutral"
                @click="() => launch(btn.launcherType)"
                :label="btn.name"
            >
                <template #leading>
                    <img class="h-4 mx-2" :src="`./icons/${btn.icon}.png`" />
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
import { Launchers } from "../../../shared/Launchers.js";

function launch(l: Launchers) {
    window.electronAPI.launch(l);
}

function quit() {
    window.electronAPI.exitApp();
}

interface PageButton {
    name: string;
    icon: string;
    route: string;
}

interface LauncherButton {
    name: string;
    icon: string;
    binary: string;
    launcherType: Launchers;
}

const pageButtons: PageButton[] = [
    {
        name: "Home",
        icon: "tdesign:home-filled",
        route: "/",
    },
    {
        name: "Game Assets",
        icon: "tdesign:control-platform-filled",
        route: "/game-assets",
    },
    {
        name: "Content Assets",
        icon: "tdesign:control-platform",
        route: "/content-assets",
    },
    {
        name: "Maps",
        icon: "tdesign:map-3d-filled",
        route: "/maps",
    },
];

const launcherButtons: LauncherButton[] = [
    {
        name: "Game",
        icon: "revolution",
        binary: "revolution.exe",
        launcherType: "game",
    },
    {
        name: "Game (Dev)",
        icon: "revolution",
        binary: "revolution.exe",
        launcherType: "game_dev",
    },
    {
        name: "Game (Tools)",
        icon: "revolution",
        binary: "revolution.exe",
        launcherType: "game_tools",
    },
    {
        name: "Hammer",
        icon: "hammer",
        binary: "revolution.exe",
        launcherType: "hammer",
    },
    {
        name: "Faceposer",
        icon: "faceposer",
        binary: "revolution.exe",
        launcherType: "faceposer",
    },
    {
        name: "HLMV",
        icon: "hlmv",
        binary: "revolution.exe",
        launcherType: "hlmv",
    },
];
</script>

<style scoped></style>
