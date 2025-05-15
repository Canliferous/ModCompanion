<template>
    <aside class="bg-default h-full flex flex-col">
        <div class="grow grid gap-1 content-start">
            <UButton
                v-for="btn of pageButtons"
                variant="soft"
                color="neutral"
                active-color="primary"
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
                @click="launchSomething"
            >
                <template #leading>
                    <img class="h-4 mx-2" :src="`./icons/${btn.icon}.png`" />
                </template>
                {{ btn.name }}
            </UButton>
        </div>
    </aside>
</template>

<script setup lang="ts">
function launchSomething() {
    window.electronAPI.launch();
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
}

const pageButtons: PageButton[] = [
    {
        name: "Home",
        icon: "i-bxs-home",
        route: "/",
    },
    {
        name: "Game Assets",
        icon: "i-bxs-cube",
        route: "/game-assets",
    },
    {
        name: "Content Assets",
        icon: "i-bx-cube",
        route: "/content-assets",
    },
    {
        name: "Maps",
        icon: "i-bx-map-alt",
        route: "/maps",
    },
];

const launcherButtons: LauncherButton[] = [
    {
        name: "Game",
        icon: "revolution",
        binary: "revolution.exe",
    },
    {
        name: "Game (Dev)",
        icon: "revolution",
        binary: "revolution.exe",
    },
    {
        name: "Game (Tools)",
        icon: "revolution",
        binary: "revolution.exe",
    },
    {
        name: "Hammer",
        icon: "hammer",
        binary: "revolution.exe",
    },
    {
        name: "Faceposer",
        icon: "faceposer",
        binary: "revolution.exe",
    },
    {
        name: "HLMV",
        icon: "hlmv",
        binary: "revolution.exe",
    },
];
</script>

<style scoped></style>
