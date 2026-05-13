<template>
    <aside class="flex p-1 pb-0">
        <div class="grow flex gap-1">
            <UNavigationMenu
                :items="menuItems"
                content-orientation="vertical"
                :arrow="false"
                :popover="{ mode: 'click', content: { align: 'start' } }"
            >
                <template #start-leading>
                    <MBitmapIcon name="mod_companion_192" class="h-4 w-4" />
                </template>
            </UNavigationMenu>

            <USeparator orientation="vertical" />

            <template v-for="id in workspaceStore.workspaces" :key="id">
                <SidebarWorkspacesItem :id="id" />
            </template>

            <UTooltip text="New Workspace">
                <UButton
                    :icon="AppDesign.Icons.ActionAdd"
                    variant="link"
                    size="xs"
                    @click="workspaceStore.createWorkspace()"
                />
            </UTooltip>
        </div>

        <UButton
            variant="ghost"
            color="neutral"
            class="text-neutral-400"
            :icon="AppDesign.Icons.SystemMinimize"
            @click="handleQuit()"
        />
        <UButton
            variant="ghost"
            color="neutral"
            class="text-neutral-400"
            :icon="AppDesign.Icons.SystemMaximize"
            @click="handleQuit()"
        />
        <UButton
            variant="ghost"
            color="neutral"
            class="text-neutral-400 hover:bg-error-500 hover:text-neutral-900"
            :icon="AppDesign.Icons.SystemClose"
            @click="handleQuit()"
        />
    </aside>
</template>

<script setup lang="ts">
import { AppDesign } from "~/design/AppDesign.js";
import * as Shared from "mod_companion_shared";
import { useWorkspaceStore } from "~/store/WorkspaceStore.js";
import { NavigationMenuItem } from "@nuxt/ui";

const workspaceStore = useWorkspaceStore();

function handleQuit() {
    window.electronAPI.app.exit();
}

function launch(option: Shared.Launchers.SharedLauncherOption) {
    window.electronAPI.app.launch(option.type, option.args);
}

const menuItems = ref<NavigationMenuItem[][]>([
    [
        {
            label: "Mod Companion",
            slot: "start" as const,
            children: [{ label: "Close" }],
        },
    ],
    [
        {
            label: "Assets",
            children: [
                {
                    label: "Convert all",
                },
            ],
        },
        {
            label: "Tools",
        },
    ],
]);
</script>

<style scoped></style>
